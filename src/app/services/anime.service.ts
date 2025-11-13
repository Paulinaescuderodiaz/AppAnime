import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Anime } from '../models/anime.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private readonly JIKAN_API_URL = 'https://api.jikan.moe/v4';
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000;

  constructor(private http: HttpClient) {}

  getTopAnimes(limit: number = 10): Observable<Anime[]> {
    const cacheKey = `top_animes_${limit}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return of(cached.data);
      }
    }

    return this.http.get<any>(`${this.JIKAN_API_URL}/top/anime?limit=${limit}`).pipe(
      map((response: any) => {
        if (response && response.data) {
          this.cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now()
          });
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching top animes:', error);
        return of([]);
      })
    );
  }

  getAnimeById(id: number): Observable<Anime | null> {
    const cacheKey = `anime_${id}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return of(cached.data);
      }
    }

    return this.http.get<any>(`${this.JIKAN_API_URL}/anime/${id}/full`).pipe(
      map((response: any) => {
        if (response && response.data) {
          this.cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now()
          });
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching anime by id:', error);
        return of(null);
      })
    );
  }

  searchAnimes(query: string, limit: number = 20): Observable<Anime[]> {
    if (!query || query.trim().length < 3) {
      return of([]);
    }

    return this.http.get<any>(`${this.JIKAN_API_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`).pipe(
      map((response: any) => {
        if (response && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error searching animes:', error);
        return of([]);
      })
    );
  }

  calculateAverageRating(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
