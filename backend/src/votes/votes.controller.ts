import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new vote',
    description:
      'Allows a user to vote for their favorite country. Only one vote per email is allowed.',
  })
  @ApiBody({ type: CreateVoteDto })
  @ApiResponse({
    status: 201,
    description: 'Vote created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Email has already voted',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  async createVote(@Body() createVoteDto: CreateVoteDto) {
    const vote = await this.votesService.createVote(createVoteDto);
    return {
      message: 'Vote registered successfully',
      data: vote,
    };
  }

  @Get('top')
  @ApiOperation({
    summary: 'Get top voted countries',
    description:
      'Returns the top 10 countries by vote count with detailed information',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of countries to return',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Top countries retrieved successfully',
  })
  async getTopCountries(@Query('limit') limit?: number) {
    const topCountries = await this.votesService.getTopCountries(
      limit ? parseInt(limit.toString(), 10) : 10,
    );
    return {
      data: topCountries,
      count: topCountries.length,
    };
  }

  @Get('check')
  @ApiOperation({
    summary: 'Check if an email has already voted',
    description: 'Returns whether the provided email has already cast a vote',
  })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email address to check',
    example: 'user@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Check completed successfully',
  })
  async checkVote(@Query('email') email: string) {
    const hasVoted = await this.votesService.hasVoted(email);
    return {
      email,
      hasVoted,
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get voting statistics',
    description: 'Returns general statistics about votes',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    const totalVotes = await this.votesService.getTotalVotes();
    return {
      totalVotes,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all votes',
    description:
      'Returns all registered votes sorted by creation date (newest first)',
  })
  @ApiResponse({
    status: 200,
    description: 'Votes retrieved successfully',
  })
  async getAllVotes() {
    const votes = await this.votesService.getAllVotes();
    return {
      data: votes,
      count: votes.length,
    };
  }
}
