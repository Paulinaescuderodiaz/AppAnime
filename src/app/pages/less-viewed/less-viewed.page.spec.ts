import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { LessViewedPage } from './less-viewed.page';
import { AnimeService } from '../../services/anime.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';

describe('LessViewedPage', () => {
  let component: LessViewedPage;
  let fixture: ComponentFixture<LessViewedPage>;
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
    const animeSpy = jasmine.createSpyObj('AnimeService', [
      'getLessViewedAnimes',
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
      providers: [
        { provide: AnimeService, useValue: animeSpy },
        { provide: ReviewService, useValue: reviewSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LessViewedPage);
    component = fixture.componentInstance;
    animeServiceSpy = TestBed.inject(AnimeService) as jasmine.SpyObj<AnimeService>;
    reviewServiceSpy = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default mocks
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    animeServiceSpy.getLessViewedAnimes.and.returnValue(of([mockAnime]));
    reviewServiceSpy.getReviewsByAnime.and.returnValue(of([mockReview]));
    animeServiceSpy.calculateAverageRating.and.returnValue(8.5);
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar datos al inicializar', async () => {
    await component.loadData();

    expect(animeServiceSpy.getLessViewedAnimes).toHaveBeenCalledWith(10);
    expect(component.lessViewedAnimes.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('debería cargar datos en ionViewWillEnter', async () => {
    await component.ionViewWillEnter();

    expect(animeServiceSpy.getLessViewedAnimes).toHaveBeenCalled();
  });

  it('debería cargar reviews para cada anime', async () => {
    await component.loadData();

    expect(reviewServiceSpy.getReviewsByAnime).toHaveBeenCalledWith(1);
    expect(component.reviews[1]).toEqual([mockReview]);
  });

  it('debería obtener el usuario actual', async () => {
    await component.loadData();

    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('debería navegar al detalle del anime', () => {
    component.viewAnimeDetail(mockAnime as any);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/anime-detail', 1]);
  });

  it('debería obtener reviews de un anime', () => {
    component.reviews[1] = [mockReview];

    const reviews = component.getAnimeReviews(1);

    expect(reviews).toEqual([mockReview]);
  });

  it('debería retornar array vacío si no hay reviews', () => {
    const reviews = component.getAnimeReviews(999);

    expect(reviews).toEqual([]);
  });

  it('debería calcular el promedio de rating', () => {
    component.reviews[1] = [mockReview];

    const average = component.getAverageRating(1);

    expect(animeServiceSpy.calculateAverageRating).toHaveBeenCalledWith([mockReview]);
    expect(average).toBe(8.5);
  });

  it('debería navegar al perfil', () => {
    component.goToProfile();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('debería navegar al home', () => {
    component.goToHome();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería formatear la fecha correctamente', () => {
    const date = new Date('2024-01-15');
    const formatted = component.formatDate(date);

    expect(formatted).toContain('2024');
  });

  it('debería obtener preview de sinopsis', () => {
    const longSynopsis = 'a'.repeat(200);
    const preview = component.getSynopsisPreview(longSynopsis);

    expect(preview.length).toBe(153); // 150 + '...'
    expect(preview).toContain('...');
  });

  it('debería retornar mensaje si no hay sinopsis', () => {
    const preview = component.getSynopsisPreview(undefined);

    expect(preview).toBe('Sin sinopsis disponible');
  });

  it('debería formatear miembros correctamente', () => {
    const formatted = component.formatMembers(1000);

    expect(formatted).toBe('1.000');
  });

  it('debería retornar 0 si no hay miembros', () => {
    const formatted = component.formatMembers(undefined);

    expect(formatted).toBe('0');
  });

  it('debería manejar errores al cargar animes', async () => {
    animeServiceSpy.getLessViewedAnimes.and.returnValue(throwError('Error'));

    await component.loadData();

    expect(component.isLoading).toBe(false);
  });

  it('debería refrescar datos', async () => {
    const event = {
      detail: {
        complete: jasmine.createSpy('complete')
      }
    };

    await component.refreshData(event);

    expect(event.detail.complete).toHaveBeenCalled();
  });

  it('debería mostrar error si el usuario no está autenticado al agregar review', async () => {
    component.currentUser = null;

    await component.addReview(mockAnime as any);

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería validar campos al enviar review', async () => {
    component.currentUser = mockUser;

    await component.submitReview(mockAnime as any, '', '');

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería validar rango de calificación', async () => {
    component.currentUser = mockUser;

    await component.submitReview(mockAnime as any, '15', 'Comment');

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });
});

