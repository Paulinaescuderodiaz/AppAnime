export interface Review {
  id?: string;
  animeId: number;
  animeName: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

