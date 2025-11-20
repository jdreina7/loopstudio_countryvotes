export interface Country {
  code: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  flag: string;
  voteCount?: number;
}

export interface VoteData {
  name: string;
  email: string;
  countryCode: string;
  countryName: string;
  flag: string;
}

export interface VoteFormData {
  name: string;
  email: string;
  country: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
