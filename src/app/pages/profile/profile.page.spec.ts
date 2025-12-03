import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController, LoadingController, IonicModule, Platform } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ProfilePage } from './profile.page';
import { AuthService } from '../../services/auth.service';
import { Camera, CameraSource } from '@capacitor/camera';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  const mockUser = {
    id: 'user_123',
    uid: 'user_123',
    email: 'test@test.com',
    fullName: 'Test User',
    displayName: 'Test User',
    photoURL: null,
    authProvider: 'Email' as const,
    createdAt: new Date().toISOString()
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'updateProfile',
      'changePassword',
      'logout'
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const loadingSpy = jasmine.createSpyObj('LoadingController', ['create']);
    const platformSpy = jasmine.createSpyObj('Platform', ['ready', 'is', 'pause', 'resume']);
    platformSpy.ready.and.returnValue(Promise.resolve(''));
    platformSpy.is.and.returnValue(false);
    platformSpy.backButton = of({} as any);
    platformSpy.pause = of({} as any);
    platformSpy.resume = of({} as any);
    platformSpy.resize = of({} as any);
    platformSpy.keyboardDidShow = of({} as any);
    platformSpy.keyboardDidHide = of({} as any);

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
      declarations: [ProfilePage],
      imports: [IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy },
        { provide: Platform, useValue: platformSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    loadingControllerSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;

    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos del usuario al inicializar', (done) => {
    component.ngOnInit();
    
    setTimeout(() => {
      expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
      expect(component.currentUser).toEqual(mockUser);
      expect(component.fullName).toBe('Test User');
      expect(component.email).toBe('test@test.com');
      done();
    }, 100);
  });

  it('debería guardar el perfil exitosamente', async () => {
    component.currentUser = mockUser;
    component.fullName = 'Updated Name';
    authServiceSpy.updateProfile.and.returnValue(Promise.resolve({ success: true, user: mockUser }));

    await component.saveProfile();

    expect(authServiceSpy.updateProfile).toHaveBeenCalledWith({
      fullName: 'Updated Name',
      photoURL: null
    });
  });

  it('debería confirmar y cerrar sesión', async () => {
    authServiceSpy.logout.and.returnValue(Promise.resolve());

    await component.confirmLogout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
  });
});

