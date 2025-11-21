import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from '../../../src/statistics/statistics.service';
import { VotesService } from '../../../src/votes/votes.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let votesService: VotesService;

  const mockDetailedStats = {
    totalVotes: 150,
    uniqueCountries: 25,
    votesByRegion: [
      { region: 'South America', votes: 45 },
      { region: 'Western Europe', votes: 60 },
      { region: 'Eastern Asia', votes: 30 },
      { region: 'Northern Africa', votes: 10 },
      { region: 'Australia and New Zealand', votes: 5 },
    ],
    timeline: [
      { date: '2025-11-15', votes: 25 },
      { date: '2025-11-16', votes: 40 },
      { date: '2025-11-17', votes: 35 },
      { date: '2025-11-18', votes: 30 },
      { date: '2025-11-19', votes: 20 },
    ],
  };

  const mockVotesByRegion = [
    { region: 'South America', votes: 45 },
    { region: 'Western Europe', votes: 60 },
    { region: 'Eastern Asia', votes: 30 },
  ];

  const mockTimeline = [
    { date: '2025-11-15', votes: 25 },
    { date: '2025-11-16', votes: 40 },
    { date: '2025-11-17', votes: 35 },
  ];

  const mockVotesService = {
    getDetailedStats: jest.fn(),
    getVotesByRegion: jest.fn(),
    getVotesTimeline: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: VotesService,
          useValue: mockVotesService,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    votesService = module.get<VotesService>(VotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDetailedStats', () => {
    it('should return detailed statistics from votes service', async () => {
      mockVotesService.getDetailedStats.mockResolvedValue(mockDetailedStats);

      const result = await service.getDetailedStats();

      expect(votesService.getDetailedStats).toHaveBeenCalled();
      expect(result).toEqual(mockDetailedStats);
    });

    it('should return statistics with all fields present', async () => {
      mockVotesService.getDetailedStats.mockResolvedValue(mockDetailedStats);

      const result = await service.getDetailedStats();

      expect(result).toHaveProperty('totalVotes');
      expect(result).toHaveProperty('uniqueCountries');
      expect(result).toHaveProperty('votesByRegion');
      expect(result).toHaveProperty('timeline');
    });

    it('should handle empty statistics', async () => {
      const emptyStats = {
        totalVotes: 0,
        uniqueCountries: 0,
        votesByRegion: [],
        timeline: [],
      };
      mockVotesService.getDetailedStats.mockResolvedValue(emptyStats);

      const result = await service.getDetailedStats();

      expect(result).toEqual(emptyStats);
    });
  });

  describe('getVotesByRegion', () => {
    it('should return votes grouped by region from votes service', async () => {
      mockVotesService.getVotesByRegion.mockResolvedValue(mockVotesByRegion);

      const result = await service.getVotesByRegion();

      expect(votesService.getVotesByRegion).toHaveBeenCalled();
      expect(result).toEqual(mockVotesByRegion);
    });

    it('should return empty array when no regional data', async () => {
      mockVotesService.getVotesByRegion.mockResolvedValue([]);

      const result = await service.getVotesByRegion();

      expect(result).toEqual([]);
    });

    it('should return array with region and votes properties', async () => {
      mockVotesService.getVotesByRegion.mockResolvedValue(mockVotesByRegion);

      const result = await service.getVotesByRegion();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('region');
        expect(result[0]).toHaveProperty('votes');
      }
    });
  });

  describe('getVotesTimeline', () => {
    it('should return votes timeline from votes service', async () => {
      mockVotesService.getVotesTimeline.mockResolvedValue(mockTimeline);

      const result = await service.getVotesTimeline();

      expect(votesService.getVotesTimeline).toHaveBeenCalled();
      expect(result).toEqual(mockTimeline);
    });

    it('should return empty array when no timeline data', async () => {
      mockVotesService.getVotesTimeline.mockResolvedValue([]);

      const result = await service.getVotesTimeline();

      expect(result).toEqual([]);
    });

    it('should return array with date and votes properties', async () => {
      mockVotesService.getVotesTimeline.mockResolvedValue(mockTimeline);

      const result = await service.getVotesTimeline();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('date');
        expect(result[0]).toHaveProperty('votes');
      }
    });
  });
});
