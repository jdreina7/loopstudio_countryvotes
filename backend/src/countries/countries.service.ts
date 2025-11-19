import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import {
  Country,
  CountryDetails,
} from '../common/interfaces/country.interface';
import { MESSAGES } from '../common/constants/messages';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);
  private readonly REST_COUNTRIES_API: string;
  private readonly API_FIELDS =
    'all?fields=name,ccn3,cca2,cca3,capital,region,subregion,flags';
  private readonly CACHE_KEY_ALL_COUNTRIES = 'all_countries';
  private readonly CACHE_TTL = 3600000; // 1 hour for countries data

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.REST_COUNTRIES_API = process.env.REST_COUNTRIES_API || '';
    if (!this.REST_COUNTRIES_API) {
      this.logger.error(MESSAGES.ENV.REST_API_MISSING);
      throw new Error(MESSAGES.ENV.REST_API_REQUIRED);
    }
  }

  async getAllCountries(): Promise<CountryDetails[]> {
    try {
      // Check cache first
      const cached = await this.cacheManager.get<CountryDetails[]>(
        this.CACHE_KEY_ALL_COUNTRIES,
      );
      if (cached) {
        this.logger.log(MESSAGES.COUNTRY.CACHED);
        return cached;
      }

      // Fetch from API
      this.logger.log(MESSAGES.COUNTRY.FETCHING_API);
      const response = await firstValueFrom(
        this.httpService.get<Country[]>(
          `${this.REST_COUNTRIES_API}/${this.API_FIELDS}`,
        ),
      );

      const countries = response.data.map((country) =>
        this.mapCountryToDetails(country),
      );

      // Cache the result
      await this.cacheManager.set(
        this.CACHE_KEY_ALL_COUNTRIES,
        countries,
        this.CACHE_TTL,
      );

      return countries;
    } catch (error) {
      this.logger.error(MESSAGES.COUNTRY.ERROR_FETCHING, error);
      throw new Error(MESSAGES.COUNTRY.FAILED_FETCH);
    }
  }

  async searchCountries(query: string): Promise<CountryDetails[]> {
    const allCountries = await this.getAllCountries();
    const normalizedQuery = query.toLowerCase();

    return allCountries.filter((country) =>
      country.name.toLowerCase().includes(normalizedQuery),
    );
  }

  async getCountryByCode(code: string): Promise<CountryDetails | null> {
    try {
      const cacheKey = `country_${code}`;
      const cached = await this.cacheManager.get<CountryDetails>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await firstValueFrom(
        this.httpService.get<Country[]>(
          `${this.REST_COUNTRIES_API}/alpha/${code}`,
        ),
      );

      if (response.data.length === 0) {
        return null;
      }

      const countryDetails = this.mapCountryToDetails(response.data[0]);
      await this.cacheManager.set(cacheKey, countryDetails, this.CACHE_TTL);

      return countryDetails;
    } catch (error) {
      this.logger.error(MESSAGES.COUNTRY.ERROR_BY_CODE(code), error);
      return null;
    }
  }

  private mapCountryToDetails(country: Country): CountryDetails {
    return {
      code: String(country.cca3),
      name: String(country.name.common),
      officialName: String(country.name.official),
      capital: country.capital?.[0] ?? 'N/A',
      region: String(country.region),
      subregion: country.subregion ?? 'N/A',
      flag: String(country.flags.svg),
    };
  }
}
