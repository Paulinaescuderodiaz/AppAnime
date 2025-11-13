import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login.page';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'loginWithGoogle']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const loadingSpy = jasmine.createSpyObj('LoadingController', ['create']);

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
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    loadingControllerSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
    
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores vacíos', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.showPassword).toBe(false);
  });

  it('debería hacer login exitosamente con credenciales válidas', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      fullName: 'Usuario Test',
      provider: 'email' as const
    };

    component.email = 'test@test.com';
    component.password = 'password123';
    authServiceSpy.login.and.returnValue(of(mockUser));

    await component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar error con credenciales inválidas', async () => {
    component.email = 'test@test.com';
    component.password = 'wrongpassword';
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Credenciales incorrectas'))
    );

    await component.login();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería hacer login con Google', async () => {
    const mockUser = {
      id: '2',
      email: 'google@gmail.com',
      fullName: 'Usuario Google',
      provider: 'google' as const
    };

    authServiceSpy.loginWithGoogle.and.returnValue(of(mockUser));

    await component.loginWithGoogle();

    expect(authServiceSpy.loginWithGoogle).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.showPassword).toBe(false);
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('debería navegar a la página de registro', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('debería validar email inválido', async () => {
    component.email = 'invalid-email';
    component.password = 'password123';

    await component.login();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería validar campos vacíos', async () => {
    component.email = '';
    component.password = '';

    await component.login();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });
});
