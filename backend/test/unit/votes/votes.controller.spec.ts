import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from '../../../src/votes/votes.controller';
import { VotesService } from '../../../src/votes/votes.service';
import { CreateVoteDto } from '../../../src/votes/dto/create-vote.dto';

describe('VotesController', () => {
  let controller: VotesController;
  let service: VotesService;

  const mockVote = {
    name: 'John Doe',
    email: 'john@example.com',
    countryCode: 'USA',
    countryName: 'United States',
    flag: 'https://flagcdn.com/us.svg',
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

  const mockVotesService = {
    createVote: jest.fn(),
    getTopCountries: jest.fn(),
    hasVoted: jest.fn(),
    getTotalVotes: jest.fn(),
    getAllVotes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [
        {
          provide: VotesService,
          useValue: mockVotesService,
        },
      ],
    }).compile();

    controller = module.get<VotesController>(VotesController);
    service = module.get<VotesService>(VotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createVote', () => {
    it('should create a vote successfully', async () => {
      const createVoteDto: CreateVoteDto = mockVote;
      mockVotesService.createVote.mockResolvedValue(mockVote);

      const result = await controller.createVote(createVoteDto);

      expect(service.createVote).toHaveBeenCalledWith(createVoteDto);
      expect(result).toEqual({
        message: 'Vote registered successfully',
        data: mockVote,
      });
    });
  });

  describe('getTopCountries', () => {
    it('should return top countries with default limit', async () => {
      const topCountries = [mockCountryDetails];
      mockVotesService.getTopCountries.mockResolvedValue(topCountries);

      const result = await controller.getTopCountries();

      expect(service.getTopCountries).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        data: topCountries,
        count: 1,
      });
    });

    it('should return top countries with custom limit', async () => {
      const topCountries = [mockCountryDetails];
      mockVotesService.getTopCountries.mockResolvedValue(topCountries);

      const result = await controller.getTopCountries(5);

      expect(service.getTopCountries).toHaveBeenCalledWith(5);
      expect(result).toEqual({
        data: topCountries,
        count: 1,
      });
    });

    it('should parse string limit to number', async () => {
      const topCountries = [mockCountryDetails];
      mockVotesService.getTopCountries.mockResolvedValue(topCountries);

      const result = await controller.getTopCountries('15' as any);

      expect(service.getTopCountries).toHaveBeenCalledWith(15);
    });
  });

  describe('checkVote', () => {
    it('should return true if email has voted', async () => {
      mockVotesService.hasVoted.mockResolvedValue(true);

      const result = await controller.checkVote('john@example.com');

      expect(service.hasVoted).toHaveBeenCalledWith('john@example.com');
      expect(result).toEqual({
        email: 'john@example.com',
        hasVoted: true,
      });
    });

    it('should return false if email has not voted', async () => {
      mockVotesService.hasVoted.mockResolvedValue(false);

      const result = await controller.checkVote('new@example.com');

      expect(service.hasVoted).toHaveBeenCalledWith('new@example.com');
      expect(result).toEqual({
        email: 'new@example.com',
        hasVoted: false,
      });
    });
  });

  describe('getStats', () => {
    it('should return total votes statistics', async () => {
      mockVotesService.getTotalVotes.mockResolvedValue(42);

      const result = await controller.getStats();

      expect(service.getTotalVotes).toHaveBeenCalled();
      expect(result).toEqual({
        totalVotes: 42,
      });
    });
  });

  describe('getAllVotes', () => {
    it('should return all votes', async () => {
      const votes = [mockVote, { ...mockVote, email: 'jane@example.com' }];
      mockVotesService.getAllVotes.mockResolvedValue(votes);

      const result = await controller.getAllVotes();

      expect(service.getAllVotes).toHaveBeenCalled();
      expect(result).toEqual({
        data: votes,
        count: 2,
      });
    });

    it('should return empty array when no votes', async () => {
      mockVotesService.getAllVotes.mockResolvedValue([]);

      const result = await controller.getAllVotes();

      expect(result).toEqual({
        data: [],
        count: 0,
      });
    });
  });
});
