import axios from 'axios';
import type { Country, VoteData, ApiResponse } from '../types';
import {
  MIN_SEARCH_QUERY_LENGTH,
  COUNTRIES_SEARCH_ENDPOINT,
  COUNTRIES_ENDPOINT,
  VOTES_ENDPOINT,
  VOTES_TOP_ENDPOINT,
  VOTES_CHECK_ENDPOINT,
  HEALTH_ENDPOINT,
  STATISTICS_ENDPOINT,
  STATISTICS_REGIONS_ENDPOINT,
  STATISTICS_TIMELINE_ENDPOINT,
  HTTP_STATUS_CONFLICT,
  DEFAULT_TOP_COUNTRIES_LIMIT,
} from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const countriesApi = {
  searchCountries: async (query: string): Promise<Country[]> => {
    if (query.length < MIN_SEARCH_QUERY_LENGTH) return [];
    const response = await api.get(`${COUNTRIES_SEARCH_ENDPOINT}?q=${query}`);
    return response.data.results;
  },

  getAllCountries: async (): Promise<Country[]> => {
    const response = await api.get(COUNTRIES_ENDPOINT);
    return response.data;
  },
};

interface VoteResponse {
  message: string;
  data: VoteData;
}

export const votesApi = {
  createVote: async (voteData: VoteData): Promise<ApiResponse<VoteResponse>> => {
    try {
      const response = await api.post(VOTES_ENDPOINT, voteData);
      return { data: response.data, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === HTTP_STATUS_CONFLICT) {
        throw new Error(
          'This email has already voted. Only one vote per email is allowed.',
        );
      }
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to submit vote');
      }
      throw new Error('Failed to submit vote');
    }
  },

  getTopCountries: async (limit: number = DEFAULT_TOP_COUNTRIES_LIMIT): Promise<Country[]> => {
    const response = await api.get(`${VOTES_TOP_ENDPOINT}?limit=${limit}`);
    return response.data.data;
  },

  checkVote: async (email: string): Promise<boolean> => {
    const response = await api.get(`${VOTES_CHECK_ENDPOINT}?email=${email}`);
    return response.data.hasVoted;
  },
};

export const healthApi = {
  getHealth: async () => {
    const response = await api.get(HEALTH_ENDPOINT);
    return response.data;
  },
};

export const statisticsApi = {
  getStatistics: async () => {
    const response = await api.get(STATISTICS_ENDPOINT);
    return response.data;
  },

  getVotesByRegion: async () => {
    const response = await api.get(STATISTICS_REGIONS_ENDPOINT);
    return response.data.data;
  },

  getTimeline: async () => {
    const response = await api.get(STATISTICS_TIMELINE_ENDPOINT);
    return response.data.data;
  },
};
