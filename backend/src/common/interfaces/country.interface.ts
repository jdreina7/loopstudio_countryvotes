export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string; // Country code (2 letters)
  cca3: string; // Country code (3 letters)
  ccn3?: string;
  capital?: readonly string[];
  region: string;
  subregion?: string;
  population?: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

export interface CountryDetails {
  code: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  flag: string;
  voteCount?: number;
}
