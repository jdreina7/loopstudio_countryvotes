import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { VotesService } from '../../../src/votes/votes.service';
import { Logger } from '@nestjs/common';
import { Vote } from '../../../src/votes/schemas/vote.schema';
import { CountriesService } from '../../../src/countries/countries.service';
import {
  IVote,
  IAggregatedVote,
} from '../../../src/common/interfaces/vote.interface';
import { MESSAGES } from '../../../src/common/constants/messages';
import { Model } from 'mongoose';

describe('VotesService', () => {
  let service: VotesService;
  let mockVoteModel: {
    findOne: jest.Mock;
    countDocuments: jest.Mock;
    find: jest.Mock;
    aggregate: jest.Mock;
    distinct: jest.Mock;
  };
  let mockCacheManager: {
    get: jest.Mock;
    set: jest.Mock;
    del: jest.Mock;
  };
  let mockCountriesService: {
    getCountryByCode: jest.Mock;
  };

  const mockVote: IVote = {
    name: 'John Doe',
    email: 'john@example.com',
    countryCode: 'USA',
    countryName: 'United States',
    flag: 'https://flagcdn.com/us.svg',
  };

  const mockAggregatedVote: IAggregatedVote = {
    _id: 'USA',
    countryName: 'United States',
    voteCount: 5,
  };

  const mockCountryDetails = {
    code: 'USA',
    name: 'United States',
    officialName: 'United States of America',
    capital: 'Washington, D.C.',
    region: 'Americas',
    subregion: 'North America',
    flag: 'https://flagcdn.com/us.svg',
    voteCount: 5,
  };

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    mockVoteModel = {
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      find: jest.fn(),
      aggregate: jest.fn(),
      distinct: jest.fn(),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockCountriesService = {
      getCountryByCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getModelToken(Vote.name),
          useValue: mockVoteModel as unknown as Model<Vote>,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: CountriesService,
          useValue: mockCountriesService,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVote', () => {
    it('should throw ConflictException if email already voted', async () => {
      mockVoteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockVote),
      });

      await expect(service.createVote(mockVote)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.createVote(mockVote)).rejects.toThrow(
        MESSAGES.VOTE.ALREADY_VOTED,
      );
    });

    it('should create a vote successfully when email has not voted', async () => {
      const mockSavedVote = { ...mockVote, _id: '123' };
      const saveMock = jest.fn().mockResolvedValue(mockSavedVote);

      mockVoteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Create a mock constructor function
      const VoteModelMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));

      // Copy other methods from mockVoteModel
      Object.assign(VoteModelMock, mockVoteModel);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          VotesService,
          {
            provide: getModelToken(Vote.name),
            useValue: VoteModelMock,
          },
          {
            provide: CACHE_MANAGER,
            useValue: mockCacheManager,
          },
          {
            provide: CountriesService,
            useValue: mockCountriesService,
          },
        ],
      }).compile();

      const serviceInstance = module.get<VotesService>(VotesService);

      const result = await serviceInstance.createVote(mockVote);

      expect(saveMock).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalled();
      expect(result).toEqual(mockSavedVote);
    });

    it('should handle MongoDB duplicate key error (code 11000)', async () => {
      const saveMock = jest
        .fn()
        .mockRejectedValue({ code: 11000, message: 'Duplicate key error' });

      mockVoteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Create a mock constructor function
      const VoteModelMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));

      // Copy other methods from mockVoteModel
      Object.assign(VoteModelMock, mockVoteModel);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          VotesService,
          {
            provide: getModelToken(Vote.name),
            useValue: VoteModelMock,
          },
          {
            provide: CACHE_MANAGER,
            useValue: mockCacheManager,
          },
          {
            provide: CountriesService,
            useValue: mockCountriesService,
          },
        ],
      }).compile();

      const serviceInstance = module.get<VotesService>(VotesService);

      await expect(serviceInstance.createVote(mockVote)).rejects.toThrow(
        ConflictException,
      );
      await expect(serviceInstance.createVote(mockVote)).rejects.toThrow(
        MESSAGES.VOTE.ALREADY_VOTED,
      );
    });
  });

  describe('getTopCountries', () => {
    it('should return cached top countries if available', async () => {
      const cachedCountries = [mockCountryDetails];
      mockCacheManager.get.mockResolvedValue(cachedCountries);

      const result = await service.getTopCountries(10);

      expect(mockCacheManager.get).toHaveBeenCalled();
      expect(result).toEqual(cachedCountries);
    });

    it('should fetch and cache top countries when cache is empty', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockVoteModel.aggregate.mockResolvedValue([mockAggregatedVote]);
      mockCountriesService.getCountryByCode.mockResolvedValue(
        mockCountryDetails,
      );

      const result = await service.getTopCountries(10);

      expect(mockVoteModel.aggregate).toHaveBeenCalled();
      expect(mockCountriesService.getCountryByCode).toHaveBeenCalledWith('USA');
      expect(mockCacheManager.set).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('voteCount', 5);
    });

    it('should handle errors when getting top countries', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockVoteModel.aggregate.mockRejectedValue(new Error('Database error'));

      await expect(service.getTopCountries(10)).rejects.toThrow(
        'Database error',
      );
    });

    it('should skip countries that fail to load from API', async () => {
      const mockInvalidVote: IAggregatedVote = {
        _id: 'INVALID',
        countryName: 'Invalid',
        voteCount: 3,
      };

      mockCacheManager.get.mockResolvedValue(null);
      mockVoteModel.aggregate.mockResolvedValue([
        mockAggregatedVote,
        mockInvalidVote,
      ]);
      mockCountriesService.getCountryByCode
        .mockResolvedValueOnce(mockCountryDetails)
        .mockResolvedValueOnce(null);

      const result = await service.getTopCountries(10);

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('USA');
    });

    it('should limit results to requested number', async () => {
      const cachedCountries = Array(15).fill(mockCountryDetails);
      mockCacheManager.get.mockResolvedValue(cachedCountries);

      const result = await service.getTopCountries(10);

      expect(result).toHaveLength(10);
    });

    it('should stop fetching countries when limit is reached', async () => {
      const mockAggregatedVotes = [
        { _id: 'USA', countryName: 'United States', voteCount: 10 },
        { _id: 'CAN', countryName: 'Canada', voteCount: 8 },
        { _id: 'MEX', countryName: 'Mexico', voteCount: 6 },
        { _id: 'BRA', countryName: 'Brazil', voteCount: 4 },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockVoteModel.aggregate.mockResolvedValue(mockAggregatedVotes);
      mockCountriesService.getCountryByCode.mockResolvedValue(
        mockCountryDetails,
      );

      const result = await service.getTopCountries(2);

      expect(result).toHaveLength(2);
      expect(mockCountriesService.getCountryByCode).toHaveBeenCalledTimes(2);
    });
  });

  describe('hasVoted', () => {
    it('should return true if email has voted', async () => {
      mockVoteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockVote),
      });

      const result = await service.hasVoted('john@example.com');

      expect(result).toBe(true);
      expect(mockVoteModel.findOne).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
    });

    it('should return false if email has not voted', async () => {
      mockVoteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.hasVoted('new@example.com');

      expect(result).toBe(false);
    });
  });

  describe('getTotalVotes', () => {
    it('should return total vote count', async () => {
      mockVoteModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(42),
      });

      const result = await service.getTotalVotes();

      expect(result).toBe(42);
      expect(mockVoteModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('getAllVotes', () => {
    it('should return all votes sorted by creation date', async () => {
      const mockVotes = [mockVote, { ...mockVote, email: 'jane@example.com' }];
      const sortMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockVotes),
      });
      mockVoteModel.find.mockReturnValue({
        sort: sortMock,
      });

      const result = await service.getAllVotes();

      expect(mockVoteModel.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockVotes);
    });
  });

  describe('getVotesByRegion', () => {
    it('should return votes grouped by region', async () => {
      const mockVotes = [
        { ...mockVote, countryCode: 'USA' },
        { ...mockVote, countryCode: 'CAN', email: 'jane@example.com' },
      ];

      const mockCountryDetailsCA = {
        ...mockCountryDetails,
        code: 'CAN',
        name: 'Canada',
        region: 'Americas',
        subregion: 'North America',
      };

      mockVoteModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockVotes),
      });

      mockCountriesService.getCountryByCode
        .mockResolvedValueOnce(mockCountryDetails)
        .mockResolvedValueOnce(mockCountryDetailsCA);

      const result = await service.getVotesByRegion();

      expect(mockVoteModel.find).toHaveBeenCalled();
      expect(mockCountriesService.getCountryByCode).toHaveBeenCalledTimes(2);
      expect(result).toEqual([{ region: 'North America', votes: 2 }]);
    });

    it('should handle votes with countries that have no subregion', async () => {
      const mockVotes = [{ ...mockVote, countryCode: 'USA' }];

      const mockCountryNoSubregion = {
        ...mockCountryDetails,
        subregion: undefined,
      };

      mockVoteModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockVotes),
      });

      mockCountriesService.getCountryByCode.mockResolvedValue(
        mockCountryNoSubregion,
      );

      const result = await service.getVotesByRegion();

      expect(result).toEqual([{ region: 'Americas', votes: 1 }]);
    });

    it('should skip votes for countries that cannot be found', async () => {
      const mockVotes = [
        { ...mockVote, countryCode: 'USA' },
        { ...mockVote, countryCode: 'INVALID', email: 'jane@example.com' },
      ];

      mockVoteModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockVotes),
      });

      mockCountriesService.getCountryByCode
        .mockResolvedValueOnce(mockCountryDetails)
        .mockResolvedValueOnce(null);

      const result = await service.getVotesByRegion();

      expect(result).toEqual([{ region: 'North America', votes: 1 }]);
    });
  });

  describe('getVotesTimeline', () => {
    it('should return votes timeline grouped by date', async () => {
      const mockVotes = [
        { createdAt: new Date('2025-11-15T10:00:00Z') },
        { createdAt: new Date('2025-11-15T15:00:00Z') },
        { createdAt: new Date('2025-11-16T12:00:00Z') },
      ];

      const sortMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockVotes),
        }),
      });

      mockVoteModel.find.mockReturnValue({
        sort: sortMock,
      });

      const result = await service.getVotesTimeline();

      expect(mockVoteModel.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ createdAt: 1 });
      expect(result).toEqual([
        { date: '2025-11-15', votes: 2 },
        { date: '2025-11-16', votes: 1 },
      ]);
    });

    it('should handle votes without createdAt', async () => {
      const mockVotes = [
        { createdAt: new Date('2025-11-15T10:00:00Z') },
        { createdAt: null },
        { createdAt: undefined },
      ];

      const sortMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockVotes),
        }),
      });

      mockVoteModel.find.mockReturnValue({
        sort: sortMock,
      });

      const result = await service.getVotesTimeline();

      expect(result).toEqual([{ date: '2025-11-15', votes: 1 }]);
    });
  });

  describe('getDetailedStats', () => {
    it('should return comprehensive statistics', async () => {
      const mockVotes = [
        { ...mockVote, createdAt: new Date('2025-11-15T10:00:00Z') },
        {
          ...mockVote,
          email: 'jane@example.com',
          countryCode: 'CAN',
          createdAt: new Date('2025-11-15T15:00:00Z'),
        },
      ];

      mockVoteModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(2),
      });

      mockVoteModel.distinct.mockReturnValue({
        exec: jest.fn().mockResolvedValue(['USA', 'CAN']),
      });

      mockVoteModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockVotes),
      });

      const sortMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockVotes),
        }),
      });

      mockVoteModel.find.mockReturnValueOnce({
        sort: sortMock,
      });

      mockCountriesService.getCountryByCode
        .mockResolvedValueOnce(mockCountryDetails)
        .mockResolvedValueOnce({
          ...mockCountryDetails,
          code: 'CAN',
          subregion: 'North America',
        });

      const result = await service.getDetailedStats();

      expect(result).toHaveProperty('totalVotes', 2);
      expect(result).toHaveProperty('uniqueCountries', 2);
      expect(result).toHaveProperty('votesByRegion');
      expect(result).toHaveProperty('timeline');
      expect(result.votesByRegion).toEqual([
        { region: 'North America', votes: 2 },
      ]);
      expect(result.timeline).toEqual([{ date: '2025-11-15', votes: 2 }]);
    });
  });
});
