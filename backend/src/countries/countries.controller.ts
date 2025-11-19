import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CountriesService } from './countries.service';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  async getAllCountries() {
    return this.countriesService.getAllCountries();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search countries by name (autocomplete)',
    description:
      'Returns countries that start with the provided query (minimum 2 characters)',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search query (minimum 2 characters)',
    example: 'un',
  })
  async searchCountries(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return {
        error: 'Query must be at least 2 characters long',
        results: [],
      };
    }
    const results = await this.countriesService.searchCountries(query);
    return { results };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get country by code' })
  @ApiParam({
    name: 'code',
    description: 'Country code (2 letters)',
    example: 'US',
  })
  async getCountryByCode(@Param('code') code: string) {
    const country = await this.countriesService.getCountryByCode(code);
    if (!country) {
      return { error: 'Country not found' };
    }
    return country;
  }
}
