import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get comprehensive statistics',
    description:
      'Returns detailed statistics including total votes, unique countries, votes by region, and timeline',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        totalVotes: 150,
        uniqueCountries: 25,
        votesByRegion: [
          { region: 'Americas', votes: 45 },
          { region: 'Europe', votes: 60 },
          { region: 'Asia', votes: 30 },
          { region: 'Africa', votes: 10 },
          { region: 'Oceania', votes: 5 },
        ],
        timeline: [
          { date: '2025-11-15', votes: 25 },
          { date: '2025-11-16', votes: 40 },
          { date: '2025-11-17', votes: 35 },
        ],
      },
    },
  })
  async getStatistics() {
    return this.statisticsService.getDetailedStats();
  }

  @Get('regions')
  @ApiOperation({
    summary: 'Get votes grouped by sub-region',
    description:
      'Returns the number of votes for each geographical sub-region',
  })
  @ApiResponse({
    status: 200,
    description: 'Regional statistics retrieved successfully',
    schema: {
      example: {
        data: [
          { region: 'South America', votes: 25 },
          { region: 'Western Europe', votes: 40 },
          { region: 'Eastern Asia', votes: 15 },
        ],
      },
    },
  })
  async getVotesByRegion() {
    const data = await this.statisticsService.getVotesByRegion();
    return { data };
  }

  @Get('timeline')
  @ApiOperation({
    summary: 'Get votes timeline',
    description: 'Returns daily vote counts over time',
  })
  @ApiResponse({
    status: 200,
    description: 'Timeline retrieved successfully',
  })
  async getTimeline() {
    const data = await this.statisticsService.getVotesTimeline();
    return { data };
  }
}
