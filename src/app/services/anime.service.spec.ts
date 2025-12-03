import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnimeService } from './anime.service';
import { Anime } from '../models/anime.model';
import { Review } from '../models/review.model';

describe('AnimeService', () => {
  let service: AnimeService;
  let httpMock: HttpTestingController;

  const mockAnime: Anime = {
    mal_id: 1,
    title: 'Test Anime',
    title_japanese: 'テストアニメ',
    images: {
      jpg: {
        large_image_url: 'test.jpg'
      },
      webp: {
        large_image_url: 'test.webp'
      }
    },
    synopsis: 'Test synopsis',
    score: 8.5,
    episodes: 12,
    status: 'Finished Airing',
    members: 1000
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnimeService]
    });

    service = TestBed.inject(AnimeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.clearCache();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('getTopAnimes', () => {
    it('debería obtener el top de animes', (done) => {
      const mockResponse = {
        data: [mockAnime]
      };

      service.getTopAnimes(10).subscribe(animes => {
        expect(animes.length).toBe(1);
        expect(animes[0].title).toBe('Test Anime');
        done();
      });

      const req = httpMock.expectOne('https://api.jikan.moe/v4/top/anime?limit=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

  });

  describe('getAnimeById', () => {
    it('debería obtener un anime por ID', (done) => {
      const mockResponse = {
        data: mockAnime
      };

      service.getAnimeById(1).subscribe(anime => {
        expect(anime).toBeTruthy();
        expect(anime?.title).toBe('Test Anime');
        done();
      });

      const req = httpMock.expectOne('https://api.jikan.moe/v4/anime/1/full');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

  });

  describe('searchAnimes', () => {
    it('debería buscar animes por query', (done) => {
      const mockResponse = {
        data: [mockAnime]
      };

      service.searchAnimes('test', 20).subscribe(animes => {
        expect(animes.length).toBe(1);
        expect(animes[0].title).toBe('Test Anime');
        done();
      });

      const req = httpMock.expectOne('https://api.jikan.moe/v4/anime?q=test&limit=20');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

  });

  describe('getLessViewedAnimes', () => {
    it('debería obtener animes menos vistos', (done) => {
      const mockResponse = {
        data: [
          { ...mockAnime, mal_id: 1, members: 100 },
          { ...mockAnime, mal_id: 2, members: 200 },
          { ...mockAnime, mal_id: 3, members: 50 }
        ]
      };

      service.getLessViewedAnimes(2).subscribe(animes => {
        expect(animes.length).toBe(2);
        expect(animes[0].members).toBe(50);
        expect(animes[1].members).toBe(100);
        done();
      });

      const req = httpMock.expectOne('https://api.jikan.moe/v4/anime?order_by=members&sort=asc&limit=4');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

  });

  describe('calculateAverageRating', () => {
    it('debería calcular el promedio de ratings correctamente', () => {
      const reviews: Review[] = [
        {
          id: '1',
          animeId: 1,
          animeName: 'Test',
          userId: '1',
          userEmail: 'test@test.com',
          userName: 'User 1',
          rating: 8,
          comment: 'Great',
          createdAt: new Date()
        },
        {
          id: '2',
          animeId: 1,
          animeName: 'Test',
          userId: '2',
          userEmail: 'test2@test.com',
          userName: 'User 2',
          rating: 9,
          comment: 'Excellent',
          createdAt: new Date()
        },
        {
          id: '3',
          animeId: 1,
          animeName: 'Test',
          userId: '3',
          userEmail: 'test3@test.com',
          userName: 'User 3',
          rating: 7,
          comment: 'Good',
          createdAt: new Date()
        }
      ];

      const average = service.calculateAverageRating(reviews);
      expect(average).toBe(8);
    });

  });

  describe('clearCache', () => {
    it('debería limpiar el cache', (done) => {
      const mockResponse = {
        data: [mockAnime]
      };

      // Llenar cache
      service.getTopAnimes(10).subscribe(() => {
        // Limpiar cache
        service.clearCache();

        // La siguiente llamada debería hacer una nueva petición HTTP
        service.getTopAnimes(10).subscribe(() => {
          expect(true).toBe(true); // Verificar que se completó
          done();
        });
        
        const req2 = httpMock.expectOne('https://api.jikan.moe/v4/top/anime?limit=10');
        req2.flush(mockResponse);
      });

      const req1 = httpMock.expectOne('https://api.jikan.moe/v4/top/anime?limit=10');
      req1.flush(mockResponse);
    });
  });
});

