import { UserDisplay } from './user';

export type Review = {
  id: string;
  user: UserDisplay;
  rating: number;
  content: string;
  createdAt: Date;
};

export type RatingSummary = {
  id: string;
  average: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};
