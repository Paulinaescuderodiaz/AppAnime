import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { StorageService } from './storage.service';
import { Review } from '../models/review.model';
import { of } from 'rxjs';

describe('ReviewService', () => {
  let service: ReviewService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockReview: Review = {
    id: 'review_1',
    animeId: 1,
    animeName: 'Test Anime',
    userId: 'user_123',
    userEmail: 'test@test.com',
    userName: 'Test User',
    rating: 9,
    comment: 'Great anime!',
    createdAt: new Date()
  };

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', [
      'saveReview',
      'getAllReviews',
      'getReviewsByAnime',
      'getReviewsByUser',
      'deleteReview'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ReviewService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(ReviewService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('saveReview', () => {
    it('debería guardar una review', (done) => {
      storageServiceSpy.saveReview.and.returnValue(Promise.resolve());

      service.saveReview(mockReview).subscribe(() => {
        expect(storageServiceSpy.saveReview).toHaveBeenCalledWith(mockReview);
        done();
      });
    });
  });

  describe('getAllReviews', () => {
    it('debería obtener todas las reviews', (done) => {
      const reviews = [mockReview];
      storageServiceSpy.getAllReviews.and.returnValue(Promise.resolve(reviews));

      service.getAllReviews().subscribe(result => {
        expect(result).toEqual(reviews);
        expect(storageServiceSpy.getAllReviews).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getReviewsByAnime', () => {
    it('debería obtener reviews por anime', (done) => {
      const reviews = [mockReview];
      storageServiceSpy.getReviewsByAnime.and.returnValue(Promise.resolve(reviews));

      service.getReviewsByAnime(1).subscribe(result => {
        expect(result).toEqual(reviews);
        expect(storageServiceSpy.getReviewsByAnime).toHaveBeenCalledWith(1);
        done();
      });
    });
  });

  describe('getReviewsByUser', () => {
    it('debería obtener reviews por usuario', (done) => {
      const reviews = [mockReview];
      storageServiceSpy.getReviewsByUser.and.returnValue(Promise.resolve(reviews));

      service.getReviewsByUser('user_123').subscribe(result => {
        expect(result).toEqual(reviews);
        expect(storageServiceSpy.getReviewsByUser).toHaveBeenCalledWith('user_123');
        done();
      });
    });
  });

  describe('deleteReview', () => {
    it('debería eliminar una review', (done) => {
      storageServiceSpy.deleteReview.and.returnValue(Promise.resolve());

      service.deleteReview('review_1').subscribe(() => {
        expect(storageServiceSpy.deleteReview).toHaveBeenCalledWith('review_1');
        done();
      });
    });
  });

  describe('hasUserReviewed', () => {
    it('debería retornar true si el usuario ya dejó una review', async () => {
      const reviews = [mockReview];
      storageServiceSpy.getReviewsByAnime.and.returnValue(Promise.resolve(reviews));

      const result = await service.hasUserReviewed('user_123', 1);

      expect(result).toBe(true);
      expect(storageServiceSpy.getReviewsByAnime).toHaveBeenCalledWith(1);
    });

    it('debería retornar false si el usuario no ha dejado una review', async () => {
      const reviews = [mockReview];
      storageServiceSpy.getReviewsByAnime.and.returnValue(Promise.resolve(reviews));

      const result = await service.hasUserReviewed('user_999', 1);

      expect(result).toBe(false);
    });
  });

  describe('getUserReviewForAnime', () => {
    it('debería obtener la review del usuario para un anime específico', async () => {
      const reviews = [mockReview];
      storageServiceSpy.getReviewsByAnime.and.returnValue(Promise.resolve(reviews));

      const result = await service.getUserReviewForAnime('user_123', 1);

      expect(result).toEqual(mockReview);
      expect(storageServiceSpy.getReviewsByAnime).toHaveBeenCalledWith(1);
    });

    it('debería retornar null si el usuario no tiene review para el anime', async () => {
      const reviews = [mockReview];
      storageServiceSpy.getReviewsByAnime.and.returnValue(Promise.resolve(reviews));

      const result = await service.getUserReviewForAnime('user_999', 1);

      expect(result).toBeNull();
    });
  });
});

