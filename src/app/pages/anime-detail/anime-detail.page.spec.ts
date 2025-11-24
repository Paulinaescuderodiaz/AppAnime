import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AnimeDetailPage } from './anime-detail.page';
import { AnimeService } from '../../services/anime.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';

describe('AnimeDetailPage', () => {
  let component: AnimeDetailPage;
  let fixture: ComponentFixture<AnimeDetailPage>;
  let animeServiceSpy: jasmine.SpyObj<AnimeService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockAnime = {
    mal_id: 1,
    title: 'Test Anime',
    title_japanese: 'テストアニメ',
    images: {
      jpg: {
        image_url: 'test.jpg',
        large_image_url: 'test-large.jpg'
      },
      webp: {
        image_url: 'test.webp',
        large_image_url: 'test-large.webp'
      }
    },
    synopsis: 'Test synopsis',
    score: 8.5,
    episodes: 12,
    status: 'Finished Airing'
  };

  beforeEach(async () => {
    const animeSpy = jasmine.createSpyObj('AnimeService', ['getAnimeById']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [AnimeDetailPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: AnimeService, useValue: animeSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimeDetailPage);
    component = fixture.componentInstance;
    animeServiceSpy = TestBed.inject(AnimeService) as jasmine.SpyObj<AnimeService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el anime al inicializar', () => {
    animeServiceSpy.getAnimeById.and.returnValue(of(mockAnime as any));
    
    component.ngOnInit();
    
    expect(animeServiceSpy.getAnimeById).toHaveBeenCalledWith(1);
    expect(component.anime).toEqual(mockAnime);
    expect(component.isLoading).toBe(false);
  });

  it('debería manejar errores al cargar el anime', () => {
    animeServiceSpy.getAnimeById.and.returnValue(throwError('Error'));
    
    component.loadAnime(1);
    
    expect(component.isLoading).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería navegar de vuelta al home', () => {
    component.goBack();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería establecer isLoading en true al iniciar', () => {
    expect(component.isLoading).toBe(true);
  });

  it('debería cargar el anime correctamente', () => {
    animeServiceSpy.getAnimeById.and.returnValue(of(mockAnime as any));
    
    component.loadAnime(1);
    
    expect(animeServiceSpy.getAnimeById).toHaveBeenCalledWith(1);
    expect(component.anime).toEqual(mockAnime);
    expect(component.isLoading).toBe(false);
  });
});

