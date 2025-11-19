import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CountriesService } from '../../../src/countries/countries.service';
import { of, throwError } from 'rxjs';
import { MESSAGES } from '../../../src/common/constants/messages';
import { Country } from '../../../src/common/interfaces/country.interface';

describe('CountriesService', () => {
  let service: CountriesService;
  let httpService: HttpService;
  let cacheManager: any;

  const mockCountry: Country = {
    name: {
      common: 'United States',
      official: 'United States of America',
    },
    cca2: 'US',
    cca3: 'USA',
    ccn3: '840',
    capital: ['Washington, D.C.'],
    region: 'Americas',
    subregion: 'North America',
    flags: {
      png: 'https://flagcdn.com/w320/us.png',
      svg: 'https://flagcdn.com/us.svg',
    },
  };

  const mockCountryDetails = {
    code: 'USA',
    name: 'United States',
    officialName: 'United States of America',
    capital: 'Washington, D.C.',
    region: 'Americas',
    subregion: 'North America',
    flag: 'https://flagcdn.com/us.svg',
  };

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    // Set environment variable for testing
    process.env.REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    delete process.env.REST_COUNTRIES_API;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw error if REST_COUNTRIES_API is not set', () => {
      delete process.env.REST_COUNTRIES_API;

      expect(() => {
        new CountriesService(httpService, cacheManager);
      }).toThrow(MESSAGES.ENV.REST_API_REQUIRED);
    });
  });

  describe('getAllCountries', () => {
    it('should return cached countries if available', async () => {
      const cachedCountries = [mockCountryDetails];
      cacheManager.get.mockResolvedValue(cachedCountries);

      const result = await service.getAllCountries();

      expect(cacheManager.get).toHaveBeenCalled();
      expect(result).toEqual(cachedCountries);
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should fetch and cache countries when cache is empty', async () => {
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: [mockCountry],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
      );

      const result = await service.getAllCountries();

      expect(httpService.get).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        code: 'USA',
        name: 'United States',
        officialName: 'United States of America',
      });
    });

    it('should handle API errors gracefully', async () => {
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      await expect(service.getAllCountries()).rejects.toThrow(
        MESSAGES.COUNTRY.FAILED_FETCH,
      );
    });

    it('should handle countries without capital', async () => {
      const countryWithoutCapital = {
        ...mockCountry,
        capital: undefined,
      };
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: [countryWithoutCapital],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
      );

      const result = await service.getAllCountries();

      expect(result[0].capital).toBe('N/A');
    });

    it('should handle countries without subregion', async () => {
      const countryWithoutSubregion = {
        ...mockCountry,
        subregion: undefined,
      };
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: [countryWithoutSubregion],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
      );

      const result = await service.getAllCountries();

      expect(result[0].subregion).toBe('N/A');
    });
  });

  describe('searchCountries', () => {
    it('should filter countries by query', async () => {
      const countries = [
        mockCountryDetails,
        {
          ...mockCountryDetails,
          code: 'CAN',
          name: 'Canada',
          officialName: 'Canada',
        },
      ];
      cacheManager.get.mockResolvedValue(countries);

      const result = await service.searchCountries('united');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('United States');
    });

    it('should be case insensitive', async () => {
      const countries = [mockCountryDetails];
      cacheManager.get.mockResolvedValue(countries);

      const result = await service.searchCountries('UNITED');

      expect(result).toHaveLength(1);
    });

    it('should return empty array when no matches', async () => {
      const countries = [mockCountryDetails];
      cacheManager.get.mockResolvedValue(countries);

      const result = await service.searchCountries('xyz');

      expect(result).toEqual([]);
    });
  });

  describe('getCountryByCode', () => {
    it('should return cached country if available', async () => {
      cacheManager.get.mockResolvedValue(mockCountryDetails);

      const result = await service.getCountryByCode('USA');

      expect(cacheManager.get).toHaveBeenCalledWith('country_USA');
      expect(result).toEqual(mockCountryDetails);
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should fetch and cache country when cache is empty', async () => {
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: [mockCountry],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
      );

      const result = await service.getCountryByCode('USA');

      expect(httpService.get).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        'country_USA',
        expect.any(Object),
        expect.any(Number),
      );
      expect(result).toMatchObject({
        code: 'USA',
        name: 'United States',
      });
    });

    it('should return null if country not found', async () => {
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
      );

      const result = await service.getCountryByCode('INVALID');

      expect(result).toBeNull();
    });

    it('should return null on API error', async () => {
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      const result = await service.getCountryByCode('USA');

      expect(result).toBeNull();
    });
  });
});
