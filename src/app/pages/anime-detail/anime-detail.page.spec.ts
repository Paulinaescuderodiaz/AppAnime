import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AnimeDetailPage } from './anime-detail.page';
import { AnimeService } from '../../services/anime.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
    const platformSpy = jasmine.createSpyObj('Platform', ['ready', 'is', 'pause', 'resume']);
    platformSpy.ready.and.returnValue(Promise.resolve(''));
    platformSpy.is.and.returnValue(false);
    platformSpy.backButton = of({} as any);
    platformSpy.pause = of({} as any);
    platformSpy.resume = of({} as any);
    platformSpy.resize = of({} as any);
    platformSpy.keyboardDidShow = of({} as any);
    platformSpy.keyboardDidHide = of({} as any);
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [AnimeDetailPage],
      imports: [IonicModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AnimeService, useValue: animeSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Platform, useValue: platformSpy }
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

  it('debería cargar el anime al inicializar', (done) => {
    animeServiceSpy.getAnimeById.and.returnValue(of(mockAnime as any));
    
    component.ngOnInit();
    
    setTimeout(() => {
      expect(animeServiceSpy.getAnimeById).toHaveBeenCalledWith(1);
      expect(component.anime).toEqual(mockAnime);
      expect(component.isLoading).toBe(false);
      done();
    }, 100);
  });

  it('debería manejar errores al cargar el anime', (done) => {
    animeServiceSpy.getAnimeById.and.returnValue(throwError(() => new Error('Error')));
    
    component.loadAnime(1);
    
    setTimeout(() => {
      expect(component.isLoading).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      done();
    }, 100);
  });

  it('debería navegar de vuelta al home', () => {
    component.goBack();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

});

