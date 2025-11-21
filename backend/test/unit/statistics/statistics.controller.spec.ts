import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from '../../../src/statistics/statistics.controller';
import { StatisticsService } from '../../../src/statistics/statistics.service';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

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

  const mockStatisticsService = {
    getDetailedStats: jest.fn(),
    getVotesByRegion: jest.fn(),
    getVotesTimeline: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStatistics', () => {
    it('should return comprehensive statistics', async () => {
      mockStatisticsService.getDetailedStats.mockResolvedValue(
        mockDetailedStats,
      );

      const result = await controller.getStatistics();

      expect(service.getDetailedStats).toHaveBeenCalled();
      expect(result).toEqual(mockDetailedStats);
    });

    it('should return statistics with empty arrays when no votes', async () => {
      const emptyStats = {
        totalVotes: 0,
        uniqueCountries: 0,
        votesByRegion: [],
        timeline: [],
      };
      mockStatisticsService.getDetailedStats.mockResolvedValue(emptyStats);

      const result = await controller.getStatistics();

      expect(result).toEqual(emptyStats);
    });
  });

  describe('getVotesByRegion', () => {
    it('should return votes grouped by region', async () => {
      mockStatisticsService.getVotesByRegion.mockResolvedValue(
        mockVotesByRegion,
      );

      const result = await controller.getVotesByRegion();

      expect(service.getVotesByRegion).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockVotesByRegion,
      });
    });

    it('should return empty data array when no votes by region', async () => {
      mockStatisticsService.getVotesByRegion.mockResolvedValue([]);

      const result = await controller.getVotesByRegion();

      expect(result).toEqual({
        data: [],
      });
    });
  });

  describe('getTimeline', () => {
    it('should return votes timeline', async () => {
      mockStatisticsService.getVotesTimeline.mockResolvedValue(mockTimeline);

      const result = await controller.getTimeline();

      expect(service.getVotesTimeline).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockTimeline,
      });
    });

    it('should return empty data array when no timeline data', async () => {
      mockStatisticsService.getVotesTimeline.mockResolvedValue([]);

      const result = await controller.getTimeline();

      expect(result).toEqual({
        data: [],
      });
    });
  });
});
