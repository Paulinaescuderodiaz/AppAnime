import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterPage } from './register.page';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['registerWithEmail', 'loginWithGoogle']);
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    expect(component.registerData.fullName).toBe('');
    expect(component.registerData.email).toBe('');
    expect(component.registerData.password).toBe('');
    expect(component.registerData.confirmPassword).toBe('');
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

    component.registerData.fullName = 'Nuevo Usuario';
    component.registerData.email = 'newuser@test.com';
    component.registerData.password = 'password123';
    component.registerData.confirmPassword = 'password123';
    authServiceSpy.registerWithEmail.and.returnValue(Promise.resolve({ success: true, user: mockUser }));

    await component.register();

    expect(authServiceSpy.registerWithEmail).toHaveBeenCalledWith(
      'newuser@test.com',
      'password123',
      'Nuevo Usuario'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería mostrar error si las contraseñas no coinciden', async () => {
    component.registerData.fullName = 'Usuario Test';
    component.registerData.email = 'test@test.com';
    component.registerData.password = 'password123';
    component.registerData.confirmPassword = 'password456';

    await component.register();

    expect(authServiceSpy.registerWithEmail).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

});
