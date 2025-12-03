import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HomePage } from './home.page';
import { AnimeService } from '../../services/anime.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let animeServiceSpy: jasmine.SpyObj<AnimeService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockAnime = {
    mal_id: 1,
    title: 'Test Anime',
    title_japanese: 'テストアニメ',
    images: {
      jpg: {
        image_url: 'test.jpg',
        small_image_url: 'test-small.jpg',
        large_image_url: 'test-large.jpg'
      },
      webp: {
        image_url: 'test.webp',
        small_image_url: 'test-small.webp',
        large_image_url: 'test-large.webp'
      }
    },
    synopsis: 'Test synopsis',
    score: 8.5,
    episodes: 12,
    status: 'Finished Airing'
  };

  const mockUser = {
    id: '1',
    email: 'test@test.com',
    fullName: 'Test User',
    provider: 'email' as const
  };

  const mockReview = {
    id: '1',
    animeId: 1,
    animeName: 'Test Anime',
    userId: '1',
    userEmail: 'test@test.com',
    userName: 'Test User',
    rating: 9,
    comment: 'Great anime!',
    createdAt: new Date()
  };

  beforeEach(async () => {
    const animeSpy = jasmine.createSpyObj('AnimeService', [
      'getTopAnimes',
      'calculateAverageRating'
    ]);
    const reviewSpy = jasmine.createSpyObj('ReviewService', [
      'getReviewsByAnime',
      'hasUserReviewed',
      'saveReview'
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const loadingSpy = jasmine.createSpyObj('LoadingController', ['create']);

    const loadingElement = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss')
    };
    loadingSpy.create.and.returnValue(Promise.resolve(loadingElement as any));

    const alertElement = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss')
    };
    alertSpy.create.and.returnValue(Promise.resolve(alertElement as any));

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AnimeService, useValue: animeSpy },
        { provide: ReviewService, useValue: reviewSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    animeServiceSpy = TestBed.inject(AnimeService) as jasmine.SpyObj<AnimeService>;
    reviewServiceSpy = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default mocks
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    animeServiceSpy.getTopAnimes.and.returnValue(of([mockAnime]));
    reviewServiceSpy.getReviewsByAnime.and.returnValue(of([mockReview]));
    animeServiceSpy.calculateAverageRating.and.returnValue(8.5);
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el top 10 de animes al iniciar', (done) => {
    component.loadData();
    
    setTimeout(() => {
      expect(animeServiceSpy.getTopAnimes).toHaveBeenCalledWith(10);
      expect(component.topAnimes.length).toBe(1);
      expect(component.topAnimes[0].title).toBe('Test Anime');
      done();
    }, 100);
  });

  it('debería navegar al detalle del anime', () => {
    component.viewAnimeDetail(mockAnime);
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/anime-detail', 1]);
  });
});
