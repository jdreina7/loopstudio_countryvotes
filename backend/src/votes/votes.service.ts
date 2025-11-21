import { Injectable, ConflictException, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Vote } from './schemas/vote.schema';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CountriesService } from '../countries/countries.service';
import { CountryDetails } from '../common/interfaces/country.interface';
import { IAggregatedVote } from '../common/interfaces/vote.interface';
import { MESSAGES } from '../common/constants/messages';
import {
  CACHE_KEY_TOP_COUNTRIES,
  CACHE_TOP_COUNTRIES_TTL_MS,
  DEFAULT_TOP_COUNTRIES_LIMIT,
  TOP_COUNTRIES_FETCH_MULTIPLIER,
  MONGODB_DUPLICATE_KEY_ERROR_CODE,
  VOTE_FIELD_COUNTRY_CODE,
  VOTE_FIELD_COUNTRY_NAME,
  VOTE_FIELD_CREATED_AT,
  ISO_DATE_SEPARATOR,
  ISO_DATE_PART_INDEX,
} from '../utils/constants';

@Injectable()
export class VotesService {
  private readonly logger = new Logger(VotesService.name);

  constructor(
    @InjectModel(Vote.name) private voteModel: Model<Vote>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly countriesService: CountriesService,
  ) {}

  async createVote(createVoteDto: CreateVoteDto): Promise<Vote> {
    try {
      // Check if email already voted
      const existingVote = await this.voteModel
        .findOne({ email: createVoteDto.email.toLowerCase() })
        .exec();

      if (existingVote) {
        throw new ConflictException(MESSAGES.VOTE.ALREADY_VOTED);
      }

      // Create the vote
      const vote = new this.voteModel({
        ...createVoteDto,
        email: createVoteDto.email.toLowerCase(),
      });

      const savedVote = await vote.save();

      // Invalidate top countries cache
      await this.cacheManager.del(CACHE_KEY_TOP_COUNTRIES);

      this.logger.log(MESSAGES.VOTE.CREATED(createVoteDto.countryName));
      return savedVote;
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Handle duplicate key error from MongoDB
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: number }).code === MONGODB_DUPLICATE_KEY_ERROR_CODE
      ) {
        throw new ConflictException(MESSAGES.VOTE.ALREADY_VOTED);
      }
      this.logger.error(MESSAGES.VOTE.ERROR_CREATING, String(error));
      throw error;
    }
  }

  async getTopCountries(
    limit: number = DEFAULT_TOP_COUNTRIES_LIMIT,
  ): Promise<CountryDetails[]> {
    try {
      // Check cache first
      const cached = await this.cacheManager.get<CountryDetails[]>(
        CACHE_KEY_TOP_COUNTRIES,
      );
      if (cached) {
        this.logger.log(MESSAGES.COUNTRY.CACHED_TOP);
        return cached.slice(0, limit);
      }

      // Aggregate votes by country
      // Fetch more than needed to ensure we have enough valid countries
      const aggregation = await this.voteModel.aggregate<IAggregatedVote>([
        {
          $group: {
            _id: `$${VOTE_FIELD_COUNTRY_CODE}`,
            countryName: { $first: `$${VOTE_FIELD_COUNTRY_NAME}` },
            voteCount: { $sum: 1 },
          },
        },
        {
          $sort: { voteCount: -1 },
        },
        {
          $limit: limit * TOP_COUNTRIES_FETCH_MULTIPLIER, // Fetch extra to compensate for potential API failures
        },
      ]);

      // Enrich with country details from external API
      const topCountries: CountryDetails[] = [];
      for (const item of aggregation) {
        if (topCountries.length >= limit) {
          break; // Stop once we have enough countries
        }

        const countryDetails = await this.countriesService.getCountryByCode(
          String(item._id),
        );
        if (countryDetails) {
          topCountries.push({
            ...countryDetails,
            voteCount: Number(item.voteCount),
          });
        }
      }

      // Cache the result
      await this.cacheManager.set(
        CACHE_KEY_TOP_COUNTRIES,
        topCountries,
        CACHE_TOP_COUNTRIES_TTL_MS,
      );

      return topCountries;
    } catch (error: unknown) {
      this.logger.error(MESSAGES.COUNTRY.ERROR_TOP, String(error));
      throw error;
    }
  }

  async hasVoted(email: string): Promise<boolean> {
    const vote = await this.voteModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    return !!vote;
  }

  async getTotalVotes(): Promise<number> {
    return this.voteModel.countDocuments().exec();
  }

  async getAllVotes() {
    return this.voteModel
      .find()
      .sort({ [VOTE_FIELD_CREATED_AT]: -1 })
      .exec();
  }

  async getVotesByRegion() {
    const allVotes = await this.voteModel.find().exec();
    const regionMap = new Map<string, number>();

    for (const vote of allVotes) {
      const countryDetails =
        await this.countriesService.getCountryByCode(vote.countryCode);
      if (countryDetails) {
        const region = countryDetails.subregion || countryDetails.region;
        regionMap.set(region, (regionMap.get(region) || 0) + 1);
      }
    }

    return Array.from(regionMap.entries()).map(([region, votes]) => ({
      region,
      votes,
    }));
  }

  async getVotesTimeline() {
    const votes = await this.voteModel
      .find()
      .sort({ [VOTE_FIELD_CREATED_AT]: 1 })
      .select(VOTE_FIELD_CREATED_AT)
      .exec();

    const timelineMap = new Map<string, number>();

    votes.forEach((vote) => {
      if (vote.createdAt) {
        const date = new Date(vote.createdAt);
        const dateKey = date.toISOString().split(ISO_DATE_SEPARATOR)[
          ISO_DATE_PART_INDEX
        ]; // YYYY-MM-DD
        timelineMap.set(dateKey, (timelineMap.get(dateKey) || 0) + 1);
      }
    });

    return Array.from(timelineMap.entries()).map(([date, votes]) => ({
      date,
      votes,
    }));
  }

  async getDetailedStats() {
    const totalVotes = await this.getTotalVotes();
    const uniqueCountries = await this.voteModel
      .distinct(VOTE_FIELD_COUNTRY_CODE)
      .exec();
    const votesByRegion = await this.getVotesByRegion();
    const timeline = await this.getVotesTimeline();

    return {
      totalVotes,
      uniqueCountries: uniqueCountries.length,
      votesByRegion,
      timeline,
    };
  }
}
