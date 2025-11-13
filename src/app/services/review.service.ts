import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Review } from '../models/review.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private storageService: StorageService) {}

  // Crear o actualizar review
  saveReview(review: Review): Observable<void> {
    return from(this.storageService.saveReview(review));
  }

  // Obtener todas las reviews
  getAllReviews(): Observable<Review[]> {
    return from(this.storageService.getAllReviews());
  }

  // Obtener reviews por anime
  getReviewsByAnime(animeId: number): Observable<Review[]> {
    return from(this.storageService.getReviewsByAnime(animeId));
  }

  // Obtener reviews por usuario
  getReviewsByUser(userId: string): Observable<Review[]> {
    return from(this.storageService.getReviewsByUser(userId));
  }

  // Eliminar review
  deleteReview(reviewId: string): Observable<void> {
    return from(this.storageService.deleteReview(reviewId));
  }

  // Verificar si el usuario ya dejó una review para un anime
  async hasUserReviewed(userId: string, animeId: number): Promise<boolean> {
    const reviews = await this.storageService.getReviewsByAnime(animeId);
    return reviews.some(r => r.userId === userId);
  }

  // Obtener review del usuario para un anime específico
  async getUserReviewForAnime(userId: string, animeId: number): Promise<Review | null> {
    const reviews = await this.storageService.getReviewsByAnime(animeId);
    const userReview = reviews.find(r => r.userId === userId);
    return userReview || null;
  }
}
