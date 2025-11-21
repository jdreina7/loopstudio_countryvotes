import { Injectable } from '@nestjs/common';
import { VotesService } from '../votes/votes.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly votesService: VotesService) {}

  async getDetailedStats() {
    return this.votesService.getDetailedStats();
  }

  async getVotesByRegion() {
    return this.votesService.getVotesByRegion();
  }

  async getVotesTimeline() {
    return this.votesService.getVotesTimeline();
  }
}
