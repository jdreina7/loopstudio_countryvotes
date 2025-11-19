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
});
