import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ProfilePage } from './profile.page';
import { AuthService } from '../../services/auth.service';
import { Camera } from '@capacitor/camera';

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
      imports: [],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertController, useValue: alertSpy },
        { provide: LoadingController, useValue: loadingSpy }
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

  it('debería cargar los datos del usuario al inicializar', () => {
    component.ngOnInit();
    
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual(mockUser);
    expect(component.fullName).toBe('Test User');
    expect(component.email).toBe('test@test.com');
  });

  it('debería cargar los datos del usuario en ionViewWillEnter', () => {
    component.ionViewWillEnter();
    
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
  });

  it('debería alternar el modo de edición', () => {
    expect(component.isEditing).toBe(false);
    
    component.toggleEdit();
    expect(component.isEditing).toBe(true);
    
    component.toggleEdit();
    expect(component.isEditing).toBe(false);
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
    expect(component.isEditing).toBe(false);
  });

  it('debería mostrar error si el nombre está vacío', async () => {
    component.fullName = '';
    
    await component.saveProfile();

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería manejar errores al guardar el perfil', async () => {
    component.currentUser = mockUser;
    component.fullName = 'Updated Name';
    authServiceSpy.updateProfile.and.returnValue(Promise.resolve({ success: false, message: 'Error' }));

    await component.saveProfile();

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería mostrar alerta para cambiar foto de perfil', async () => {
    await component.changeProfilePicture();

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería tomar foto desde la cámara', async () => {
    spyOn(Camera, 'getPhoto').and.returnValue(Promise.resolve({
      dataUrl: 'data:image/png;base64,test',
      format: 'png',
      saved: false
    } as any));
    
    component.currentUser = mockUser;
    authServiceSpy.updateProfile.and.returnValue(Promise.resolve({ success: true, user: mockUser }));

    await component.takePicture(Camera.CameraSource.Camera);

    expect(Camera.getPhoto).toHaveBeenCalled();
    expect(component.profileImage).toBe('data:image/png;base64,test');
  });

  it('debería mostrar alerta para cambiar contraseña', async () => {
    await component.changePassword();

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería procesar cambio de contraseña exitosamente', async () => {
    component.currentUser = mockUser;
    authServiceSpy.changePassword.and.returnValue(Promise.resolve({ success: true }));

    await component.processPasswordChange({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    });

    expect(authServiceSpy.changePassword).toHaveBeenCalledWith('oldpass', 'newpass123');
  });

  it('debería validar que las contraseñas coincidan', async () => {
    await component.processPasswordChange({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'different'
    });

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería validar longitud mínima de contraseña', async () => {
    await component.processPasswordChange({
      currentPassword: 'oldpass',
      newPassword: 'short',
      confirmPassword: 'short'
    });

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería mostrar alerta para cerrar sesión', async () => {
    await component.logout();

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('debería confirmar y cerrar sesión', async () => {
    authServiceSpy.logout.and.returnValue(Promise.resolve());

    await component.confirmLogout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
  });

  it('debería navegar de vuelta al home', () => {
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería cargar la foto de perfil del usuario', () => {
    const userWithPhoto = { ...mockUser, photoURL: 'data:image/png;base64,test' };
    authServiceSpy.getCurrentUser.and.returnValue(of(userWithPhoto));

    component.loadUserData();

    expect(component.profileImage).toBe('data:image/png;base64,test');
  });
});

