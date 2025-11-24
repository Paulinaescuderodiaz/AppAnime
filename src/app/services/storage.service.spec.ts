import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';
import { Review } from '../models/review.model';

describe('StorageService', () => {
  let service: StorageService;
  let storageSpy: jasmine.SpyObj<Storage>;

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

  beforeEach(async () => {
    const storageMock = jasmine.createSpyObj('Storage', [
      'create',
      'get',
      'set',
      'remove',
      'keys'
    ]);

    // Mock para create que retorna el mismo storage
    storageMock.create.and.returnValue(Promise.resolve(storageMock));

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: storageMock }
      ]
    });

    service = TestBed.inject(StorageService);
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;

    // Setup default mocks
    storageSpy.get.and.returnValue(Promise.resolve(null));
    storageSpy.set.and.returnValue(Promise.resolve());
    storageSpy.remove.and.returnValue(Promise.resolve());
    storageSpy.keys.and.returnValue(Promise.resolve([]));
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('debería inicializar el storage', async () => {
      await service.init();
      expect(storageSpy.create).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('debería guardar un valor en el storage', async () => {
      await service.set('testKey', 'testValue');
      expect(storageSpy.set).toHaveBeenCalledWith('animereview_testKey', 'testValue');
    });

    it('debería inicializar el storage si no está inicializado', async () => {
      // Simular que el storage no está inicializado
      (service as any)._storage = null;
      
      await service.set('testKey', 'testValue');
      expect(storageSpy.create).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('debería obtener un valor del storage', async () => {
      storageSpy.get.and.returnValue(Promise.resolve('testValue'));
      
      const result = await service.get('testKey');
      expect(storageSpy.get).toHaveBeenCalledWith('animereview_testKey');
      expect(result).toBe('testValue');
    });

    it('debería retornar null si el valor no existe', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(null));
      
      const result = await service.get('nonExistentKey');
      expect(result).toBeNull();
    });

    it('debería inicializar el storage si no está inicializado', async () => {
      (service as any)._storage = null;
      
      await service.get('testKey');
      expect(storageSpy.create).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debería eliminar un valor del storage', async () => {
      await service.remove('testKey');
      expect(storageSpy.remove).toHaveBeenCalledWith('animereview_testKey');
    });

    it('debería inicializar el storage si no está inicializado', async () => {
      (service as any)._storage = null;
      
      await service.remove('testKey');
      expect(storageSpy.create).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('debería limpiar todos los valores del storage', async () => {
      storageSpy.keys.and.returnValue(Promise.resolve(['animereview_key1', 'animereview_key2', 'other_key']));
      
      await service.clear();
      
      expect(storageSpy.remove).toHaveBeenCalledWith('animereview_key1');
      expect(storageSpy.remove).toHaveBeenCalledWith('animereview_key2');
      expect(storageSpy.remove).not.toHaveBeenCalledWith('other_key');
    });
  });

  describe('keys', () => {
    it('debería obtener todas las keys del storage con el prefijo correcto', async () => {
      storageSpy.keys.and.returnValue(Promise.resolve([
        'animereview_key1',
        'animereview_key2',
        'other_key'
      ]));
      
      const keys = await service.keys();
      
      expect(keys).toEqual(['key1', 'key2']);
    });
  });

  describe('saveReview', () => {
    it('debería guardar una nueva review', async () => {
      const newReview: Review = {
        ...mockReview,
        id: undefined
      };
      
      storageSpy.get.and.returnValue(Promise.resolve([]));
      
      await service.saveReview(newReview);
      
      expect(storageSpy.get).toHaveBeenCalledWith('animereview_reviews');
      expect(storageSpy.set).toHaveBeenCalled();
    });

    it('debería actualizar una review existente', async () => {
      const existingReview = { ...mockReview };
      storageSpy.get.and.returnValue(Promise.resolve([existingReview]));
      
      const updatedReview: Review = {
        ...existingReview,
        comment: 'Updated comment'
      };
      
      await service.saveReview(updatedReview);
      
      expect(storageSpy.set).toHaveBeenCalled();
    });
  });

  describe('getAllReviews', () => {
    it('debería obtener todas las reviews', async () => {
      const reviews = [mockReview];
      storageSpy.get.and.returnValue(Promise.resolve(reviews));
      
      const result = await service.getAllReviews();
      
      expect(result).toEqual(reviews);
      expect(storageSpy.get).toHaveBeenCalledWith('animereview_reviews');
    });

    it('debería retornar array vacío si no hay reviews', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(null));
      
      const result = await service.getAllReviews();
      
      expect(result).toEqual([]);
    });
  });

  describe('getReviewsByAnime', () => {
    it('debería obtener reviews filtradas por anime', async () => {
      const reviews = [
        mockReview,
        { ...mockReview, id: 'review_2', animeId: 2 }
      ];
      storageSpy.get.and.returnValue(Promise.resolve(reviews));
      
      const result = await service.getReviewsByAnime(1);
      
      expect(result.length).toBe(1);
      expect(result[0].animeId).toBe(1);
    });
  });

  describe('getReviewsByUser', () => {
    it('debería obtener reviews filtradas por usuario', async () => {
      const reviews = [
        mockReview,
        { ...mockReview, id: 'review_2', userId: 'user_999' }
      ];
      storageSpy.get.and.returnValue(Promise.resolve(reviews));
      
      const result = await service.getReviewsByUser('user_123');
      
      expect(result.length).toBe(1);
      expect(result[0].userId).toBe('user_123');
    });
  });

  describe('deleteReview', () => {
    it('debería eliminar una review', async () => {
      const reviews = [mockReview];
      storageSpy.get.and.returnValue(Promise.resolve(reviews));
      
      await service.deleteReview('review_1');
      
      expect(storageSpy.set).toHaveBeenCalledWith('animereview_reviews', []);
    });
  });
});

