import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly STORAGE_PREFIX = 'animereview_';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.initializeDefaultData();
  }

  private async initializeDefaultData(): Promise<void> {
    const initialized = await this._storage?.get(this.getKey('initialized'));
    if (!initialized) {
      const defaultData = {
        users: [],
        reviews: [],
        favorites: [],
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'es'
        }
      };

      await this._storage?.set(this.getKey('users'), defaultData.users);
      await this._storage?.set(this.getKey('reviews'), defaultData.reviews);
      await this._storage?.set(this.getKey('favorites'), defaultData.favorites);
      await this._storage?.set(this.getKey('preferences'), defaultData.preferences);
      await this._storage?.set(this.getKey('initialized'), true);
    }
  }

  private getKey(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`;
  }

  async set(key: string, value: any): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
    await this._storage?.set(this.getKey(key), value);
  }

  async get(key: string): Promise<any> {
    if (!this._storage) {
      await this.init();
    }
    return await this._storage?.get(this.getKey(key)) || null;
  }

  async remove(key: string): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
    await this._storage?.remove(this.getKey(key));
  }

  async clear(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
    const keys = await this.keys();
    for (const key of keys) {
      await this._storage?.remove(this.getKey(key));
    }
    await this.initializeDefaultData();
  }

  async keys(): Promise<string[]> {
    if (!this._storage) {
      await this.init();
    }
    const allKeys = await this._storage?.keys() || [];
    return allKeys
      .filter(key => key.startsWith(this.STORAGE_PREFIX))
      .map(key => key.replace(this.STORAGE_PREFIX, ''));
  }

  // Métodos específicos para Reviews
  async saveReview(review: Review): Promise<void> {
    const reviews = await this.getAllReviews();
    if (review.id) {
      // Actualizar review existente
      const index = reviews.findIndex(r => r.id === review.id);
      if (index !== -1) {
        reviews[index] = { ...review, updatedAt: new Date().toISOString() };
      } else {
        reviews.push({ ...review, id: `review_${Date.now()}`, createdAt: new Date().toISOString() });
      }
    } else {
      // Crear nueva review
      reviews.push({ ...review, id: `review_${Date.now()}`, createdAt: new Date().toISOString() });
    }
    await this.set('reviews', reviews);
  }

  async getAllReviews(): Promise<Review[]> {
    const reviews = await this.get('reviews');
    return reviews || [];
  }

  async getReviewsByAnime(animeId: number): Promise<Review[]> {
    const reviews = await this.getAllReviews();
    return reviews.filter(r => r.animeId === animeId);
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const reviews = await this.getAllReviews();
    return reviews.filter(r => r.userId === userId);
  }

  async deleteReview(reviewId: string): Promise<void> {
    const reviews = await this.getAllReviews();
    const filteredReviews = reviews.filter(r => r.id !== reviewId);
    await this.set('reviews', filteredReviews);
  }
}
