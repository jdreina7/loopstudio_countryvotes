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
import {
  REST_COUNTRIES_ENDPOINT_ALL,
  CACHE_KEY_ALL_COUNTRIES,
  CACHE_COUNTRIES_TTL_MS,
  CACHE_KEY_COUNTRY_PREFIX,
  REST_COUNTRIES_ENDPOINT_ALPHA_PREFIX,
  DEFAULT_CAPITAL,
  DEFAULT_SUBREGION,
} from '../utils/constants';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);
  private readonly REST_COUNTRIES_API: string;

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
        CACHE_KEY_ALL_COUNTRIES,
      );
      if (cached) {
        this.logger.log(MESSAGES.COUNTRY.CACHED);
        return cached;
      }

      // Fetch from API
      this.logger.log(MESSAGES.COUNTRY.FETCHING_API);
      const response = await firstValueFrom(
        this.httpService.get<Country[]>(
          `${this.REST_COUNTRIES_API}/${REST_COUNTRIES_ENDPOINT_ALL}`,
        ),
      );

      const countries = response.data.map((country) =>
        this.mapCountryToDetails(country),
      );

      // Cache the result
      await this.cacheManager.set(
        CACHE_KEY_ALL_COUNTRIES,
        countries,
        CACHE_COUNTRIES_TTL_MS,
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
      const cacheKey = `${CACHE_KEY_COUNTRY_PREFIX}${code}`;
      const cached = await this.cacheManager.get<CountryDetails>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await firstValueFrom(
        this.httpService.get<Country[]>(
          `${this.REST_COUNTRIES_API}${REST_COUNTRIES_ENDPOINT_ALPHA_PREFIX}${code}`,
        ),
      );

      if (response.data.length === 0) {
        return null;
      }

      const countryDetails = this.mapCountryToDetails(response.data[0]);
      await this.cacheManager.set(
        cacheKey,
        countryDetails,
        CACHE_COUNTRIES_TTL_MS,
      );

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
      capital: country.capital?.[0] ?? DEFAULT_CAPITAL,
      region: String(country.region),
      subregion: country.subregion ?? DEFAULT_SUBREGION,
      flag: String(country.flags.svg),
    };
  }
}
