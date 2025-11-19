import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from '../../../src/countries/countries.controller';
import { CountriesService } from '../../../src/countries/countries.service';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  const mockCountryDetails = {
    code: 'USA',
    name: 'United States',
    officialName: 'United States of America',
    capital: 'Washington, D.C.',
    region: 'Americas',
    subregion: 'North America',
    flag: 'https://flagcdn.com/us.svg',
  };

  const mockCountriesService = {
    getAllCountries: jest.fn(() => []),
    searchCountries: jest.fn(() => []),
    getCountryByCode: jest.fn(() => null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: mockCountriesService,
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCountries', () => {
    it('should return all countries', async () => {
      const countries = [mockCountryDetails];
      mockCountriesService.getAllCountries.mockResolvedValue(countries);

      const result = await controller.getAllCountries();

      expect(service.getAllCountries).toHaveBeenCalled();
      expect(result).toEqual(countries);
    });

    it('should return empty array when no countries', async () => {
      mockCountriesService.getAllCountries.mockResolvedValue([]);

      const result = await controller.getAllCountries();

      expect(result).toEqual([]);
    });
  });

  describe('searchCountries', () => {
    it('should search countries by query', async () => {
      const countries = [mockCountryDetails];
      mockCountriesService.searchCountries.mockResolvedValue(countries);

      const result = await controller.searchCountries('United');

      expect(service.searchCountries).toHaveBeenCalledWith('United');
      expect(result).toEqual({
        results: countries,
      });
    });

    it('should return empty results for no matches', async () => {
      mockCountriesService.searchCountries.mockResolvedValue([]);

      const result = await controller.searchCountries('xyz');

      expect(result).toEqual({
        results: [],
      });
    });

    it('should return error for query less than 2 characters', async () => {
      const result = await controller.searchCountries('a');

      expect(service.searchCountries).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: 'Query must be at least 2 characters long',
        results: [],
      });
    });

    it('should return error for empty query', async () => {
      const result = await controller.searchCountries('');

      expect(service.searchCountries).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: 'Query must be at least 2 characters long',
        results: [],
      });
    });
  });

  describe('getCountryByCode', () => {
    it('should return country by code', async () => {
      mockCountriesService.getCountryByCode.mockResolvedValue(mockCountryDetails);

      const result = await controller.getCountryByCode('USA');

      expect(service.getCountryByCode).toHaveBeenCalledWith('USA');
      expect(result).toEqual(mockCountryDetails);
    });

    it('should return error for invalid code', async () => {
      mockCountriesService.getCountryByCode.mockResolvedValue(null);

      const result = await controller.getCountryByCode('INVALID');

      expect(service.getCountryByCode).toHaveBeenCalledWith('INVALID');
      expect(result).toEqual({ error: 'Country not found' });
    });
  });
});
