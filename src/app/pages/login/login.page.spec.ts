import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login.page';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['loginWithEmail', 'loginWithGoogle']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['get', 'set']);
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

    // Mock del loading
    const loadingElement = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss')
    };
    loadingSpy.create.and.returnValue(Promise.resolve(loadingElement as any));

    // Mock del alert
    const alertElement = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss')
    };
    alertSpy.create.and.returnValue(Promise.resolve(alertElement as any));

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy },
        { provide: Platform, useValue: platformSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    loadingControllerSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
    
    // Setup default mocks
    storageSpy.get.and.returnValue(Promise.resolve(null));
    
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores vacíos', () => {
    expect(component.loginData.email).toBe('');
    expect(component.loginData.password).toBe('');
    expect(component.showPassword).toBe(false);
  });

  it('debería hacer login exitosamente con credenciales válidas', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      fullName: 'Usuario Test',
      provider: 'email' as const
    };

    component.loginData.email = 'test@test.com';
    component.loginData.password = 'password123';
    authServiceSpy.loginWithEmail.and.returnValue(Promise.resolve({ success: true, user: mockUser }));

    await component.login();

    expect(authServiceSpy.loginWithEmail).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar error con credenciales inválidas', async () => {
    component.loginData.email = 'test@test.com';
    component.loginData.password = 'wrongpassword';
    authServiceSpy.loginWithEmail.and.returnValue(
      Promise.reject(new Error('Credenciales incorrectas'))
    );

    await component.login();

    expect(authServiceSpy.loginWithEmail).toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería hacer login con Google', async () => {
    const mockUser = {
      id: '2',
      email: 'google@gmail.com',
      fullName: 'Usuario Google',
      provider: 'google' as const
    };

    authServiceSpy.loginWithGoogle.and.returnValue(Promise.resolve({ success: true, user: mockUser }));

    await component.loginWithGoogle();

    expect(authServiceSpy.loginWithGoogle).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

});
