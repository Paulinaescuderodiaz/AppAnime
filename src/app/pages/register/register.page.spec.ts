import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterPage } from './register.page';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register', 'loginWithGoogle']);
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
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
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
    expect(component.fullName).toBe('');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
    expect(component.showPassword).toBe(false);
    expect(component.showConfirmPassword).toBe(false);
  });

  it('debería registrar usuario exitosamente', async () => {
    const mockUser = {
      id: '1',
      email: 'newuser@test.com',
      fullName: 'Nuevo Usuario',
      provider: 'email' as const
    };

    component.fullName = 'Nuevo Usuario';
    component.email = 'newuser@test.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    authServiceSpy.register.and.returnValue(of(mockUser));

    await component.register();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'newuser@test.com',
      'password123',
      'Nuevo Usuario'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería mostrar error si las contraseñas no coinciden', async () => {
    component.fullName = 'Usuario Test';
    component.email = 'test@test.com';
    component.password = 'password123';
    component.confirmPassword = 'password456';

    await component.register();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería validar contraseña mínima de 6 caracteres', async () => {
    component.fullName = 'Usuario Test';
    component.email = 'test@test.com';
    component.password = '12345';
    component.confirmPassword = '12345';

    await component.register();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería validar nombre mínimo de 3 caracteres', async () => {
    component.fullName = 'AB';
    component.email = 'test@test.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    await component.register();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería validar formato de email', async () => {
    component.fullName = 'Usuario Test';
    component.email = 'invalid-email';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    await component.register();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería registrar con Google', async () => {
    const mockUser = {
      id: '2',
      email: 'google@gmail.com',
      fullName: 'Usuario Google',
      provider: 'google' as const
    };

    authServiceSpy.loginWithGoogle.and.returnValue(of(mockUser));

    await component.registerWithGoogle();

    expect(authServiceSpy.loginWithGoogle).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería alternar visibilidad de contraseña', () => {
    expect(component.showPassword).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
  });

  it('debería alternar visibilidad de confirmar contraseña', () => {
    expect(component.showConfirmPassword).toBe(false);
    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBe(true);
  });

  it('debería navegar a login', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
