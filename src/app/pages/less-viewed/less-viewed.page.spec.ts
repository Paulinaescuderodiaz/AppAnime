import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { LessViewedPage } from './less-viewed.page';
import { AnimeService } from '../../services/anime.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LessViewedPage', () => {
  let component: LessViewedPage;
  let fixture: ComponentFixture<LessViewedPage>;
  let animeService: AnimeService;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let httpMock: HttpTestingController;

  const mockAnime = {
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
    members: 100
  };

  const mockUser = {
    id: 'user_123',
    uid: 'user_123',
    email: 'test@test.com',
    fullName: 'Test User',
    authProvider: 'Email' as const
  };

  const mockReview = {
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
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
    };
    loadingSpy.create.and.returnValue(Promise.resolve(loadingElement as any));

    const alertElement = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
    };
    alertSpy.create.and.returnValue(Promise.resolve(alertElement as any));

    await TestBed.configureTestingModule({
      declarations: [LessViewedPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AnimeService, // Usar el servicio real con HttpClientTestingModule
        { provide: ReviewService, useValue: reviewSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LessViewedPage);
    component = fixture.componentInstance;
    animeService = TestBed.inject(AnimeService);
    httpMock = TestBed.inject(HttpTestingController);
    reviewServiceSpy = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;

    // Setup default mocks
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    reviewServiceSpy.getReviewsByAnime.and.returnValue(of([mockReview]));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar datos al inicializar', (done) => {
    component.loadData();

    const req = httpMock.expectOne('https://api.jikan.moe/v4/anime?order_by=members&sort=asc&limit=20');
    req.flush({ data: [mockAnime] });

    setTimeout(() => {
      expect(component.lessViewedAnimes.length).toBe(1);
      expect(component.isLoading).toBe(false);
      done();
    }, 200);
  });

  it('debería navegar al detalle del anime', () => {
    component.viewAnimeDetail(mockAnime as any);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/anime-detail', 1]);
  });
});

