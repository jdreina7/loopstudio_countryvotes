import axios from 'axios';
import type { Country, VoteData, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const countriesApi = {
  searchCountries: async (query: string): Promise<Country[]> => {
    if (query.length < 2) return [];
    const response = await api.get(`/api/v1/countries/search?q=${query}`);
    return response.data.results;
  },

  getAllCountries: async (): Promise<Country[]> => {
    const response = await api.get('/api/v1/countries');
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
      const response = await api.post('/api/v1/votes', voteData);
      return { data: response.data, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
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

  getTopCountries: async (limit: number = 10): Promise<Country[]> => {
    const response = await api.get(`/api/v1/votes/top?limit=${limit}`);
    return response.data.data;
  },

  checkVote: async (email: string): Promise<boolean> => {
    const response = await api.get(`/api/v1/votes/check?email=${email}`);
    return response.data.hasVoted;
  },
};

export const healthApi = {
  getHealth: async () => {
    const response = await api.get('/api/v1/health');
    return response.data;
  },
};

export const statisticsApi = {
  getStatistics: async () => {
    const response = await api.get('/api/v1/statistics');
    return response.data;
  },

  getVotesByRegion: async () => {
    const response = await api.get('/api/v1/statistics/regions');
    return response.data.data;
  },

  getTimeline: async () => {
    const response = await api.get('/api/v1/statistics/timeline');
    return response.data.data;
  },
};
