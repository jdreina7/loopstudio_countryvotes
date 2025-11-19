export interface IVote {
  name: string;
  email: string;
  countryCode: string;
  countryName: string;
  flag: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVoteDocument extends IVote {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAggregatedVote {
  _id: string;
  countryName: string;
  voteCount: number;
}
