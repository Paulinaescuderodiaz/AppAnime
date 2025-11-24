import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockUser: User = {
    uid: 'user_123',
    id: 'user_123',
    email: 'test@test.com',
    fullName: 'Test User',
    displayName: 'Test User',
    photoURL: null,
    authProvider: 'Email',
    createdAt: new Date().toISOString()
  };

  beforeEach(async () => {
    const storageSpy = jasmine.createSpyObj('StorageService', [
      'get',
      'set',
      'remove',
      'getAllReviews'
    ]);

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    // Setup default mocks
    storageServiceSpy.get.and.returnValue(Promise.resolve(null));
    storageServiceSpy.set.and.returnValue(Promise.resolve());
    storageServiceSpy.remove.and.returnValue(Promise.resolve());
    storageServiceSpy.getAllReviews.and.returnValue(Promise.resolve([]));
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('loadCurrentUser', () => {
    it('debería cargar el usuario actual desde el storage', async () => {
      storageServiceSpy.get.and.returnValue(Promise.resolve(mockUser));
      
      await service.loadCurrentUser();
      
      expect(storageServiceSpy.get).toHaveBeenCalledWith('currentUser');
    });

    it('debería manejar cuando no hay usuario en el storage', async () => {
      storageServiceSpy.get.and.returnValue(Promise.resolve(null));
      
      await service.loadCurrentUser();
      
      expect(storageServiceSpy.get).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('getCurrentUser', () => {
    it('debería retornar un Observable del usuario actual', (done) => {
      service.getCurrentUser().subscribe(user => {
        expect(user).toBeDefined();
        done();
      });
    });
  });

  describe('getCurrentUserValue', () => {
    it('debería retornar el valor actual del usuario', () => {
      const user = service.getCurrentUserValue();
      expect(user).toBeDefined();
    });
  });

  describe('loginWithEmail', () => {
    it('debería hacer login exitoso con credenciales válidas', async () => {
      const users = [{
        uid: 'user_123',
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Test User',
        createdAt: new Date().toISOString()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve(users));
      
      const result = await service.loginWithEmail('test@test.com', 'password123');
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@test.com');
      expect(storageServiceSpy.set).toHaveBeenCalled();
    });

    it('debería fallar con credenciales incorrectas', async () => {
      const users = [{
        uid: 'user_123',
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Test User',
        createdAt: new Date().toISOString()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve(users));
      
      const result = await service.loginWithEmail('test@test.com', 'wrongpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales incorrectas');
    });

    it('debería manejar errores durante el login', async () => {
      storageServiceSpy.get.and.throwError('Storage error');
      
      const result = await service.loginWithEmail('test@test.com', 'password123');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error al iniciar sesión');
    });
  });

  describe('registerWithEmail', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      storageServiceSpy.get.and.returnValue(Promise.resolve([]));
      
      const result = await service.registerWithEmail(
        'newuser@test.com',
        'password123',
        'New User'
      );
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('newuser@test.com');
      expect(result.user?.fullName).toBe('New User');
      expect(storageServiceSpy.set).toHaveBeenCalled();
    });

    it('debería fallar si el email ya está registrado', async () => {
      const users = [{
        uid: 'user_123',
        email: 'existing@test.com',
        password: 'password123',
        fullName: 'Existing User',
        createdAt: new Date().toISOString()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve(users));
      
      const result = await service.registerWithEmail(
        'existing@test.com',
        'password123',
        'New User'
      );
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Este email ya está registrado');
    });

    it('debería manejar errores durante el registro', async () => {
      storageServiceSpy.get.and.throwError('Storage error');
      
      const result = await service.registerWithEmail(
        'newuser@test.com',
        'password123',
        'New User'
      );
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error al registrar usuario');
    });
  });

  describe('loginWithGoogle', () => {
    it('debería hacer login con Google exitosamente', async () => {
      const result = await service.loginWithGoogle();
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.authProvider).toBe('Google');
      expect(storageServiceSpy.set).toHaveBeenCalled();
    });

    it('debería manejar errores durante el login con Google', async () => {
      storageServiceSpy.set.and.throwError('Storage error');
      
      const result = await service.loginWithGoogle();
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error al iniciar sesión con Google');
    });
  });

  describe('updatePassword', () => {
    beforeEach(() => {
      storageServiceSpy.get.and.returnValue(Promise.resolve(mockUser));
      service['currentUserSubject'].next(mockUser);
    });

    it('debería actualizar la contraseña exitosamente', async () => {
      const users = [{
        uid: 'user_123',
        email: 'test@test.com',
        password: 'oldpassword',
        fullName: 'Test User',
        createdAt: new Date().toISOString()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve(users));
      
      const result = await service.updatePassword('oldpassword', 'newpassword');
      
      expect(result.success).toBe(true);
      expect(storageServiceSpy.set).toHaveBeenCalled();
    });

    it('debería fallar si la contraseña actual es incorrecta', async () => {
      const users = [{
        uid: 'user_123',
        email: 'test@test.com',
        password: 'oldpassword',
        fullName: 'Test User',
        createdAt: new Date().toISOString()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve(users));
      
      const result = await service.updatePassword('wrongpassword', 'newpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Contraseña actual incorrecta');
    });

    it('debería fallar para usuarios de Google', async () => {
      const googleUser = { ...mockUser, authProvider: 'Google' };
      service['currentUserSubject'].next(googleUser);
      
      const result = await service.updatePassword('oldpassword', 'newpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('No se puede cambiar la contraseña de una cuenta de Google');
    });
  });

  describe('updateProfile', () => {
    beforeEach(() => {
      service['currentUserSubject'].next(mockUser);
    });

    it('debería actualizar el nombre completo', async () => {
      const users = [{
        uid: 'user_123',
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Test User',
        createdAt: new Date().toISOString()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve(users));
      
      const result = await service.updateProfile({ fullName: 'Updated Name' });
      
      expect(result.success).toBe(true);
      expect(result.user?.fullName).toBe('Updated Name');
      expect(storageServiceSpy.set).toHaveBeenCalled();
    });

    it('debería actualizar la foto de perfil', async () => {
      const users = [{
        uid: 'user_123',
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Test User',
        createdAt: new Date().toISOString()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve(users));
      
      const photoURL = 'data:image/png;base64,test';
      const result = await service.updateProfile({ photoURL });
      
      expect(result.success).toBe(true);
      expect(result.user?.photoURL).toBe(photoURL);
      expect(storageServiceSpy.set).toHaveBeenCalled();
    });

    it('debería fallar si no hay usuario autenticado', async () => {
      service['currentUserSubject'].next(null);
      
      const result = await service.updateProfile({ fullName: 'Updated Name' });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('No hay usuario autenticado');
    });
  });

  describe('logout', () => {
    it('debería cerrar sesión y limpiar el storage', async () => {
      service['currentUserSubject'].next(mockUser);
      
      await service.logout();
      
      expect(storageServiceSpy.remove).toHaveBeenCalledWith('currentUser');
      expect(service.getCurrentUserValue()).toBeNull();
    });
  });

  describe('deleteAccount', () => {
    it('debería eliminar la cuenta y todas las reseñas del usuario', async () => {
      service['currentUserSubject'].next(mockUser);
      
      const reviews = [{
        id: 'review_1',
        animeId: 1,
        userId: 'user_123',
        userEmail: 'test@test.com',
        userName: 'Test User',
        rating: 9,
        comment: 'Great!',
        createdAt: new Date()
      }];
      
      storageServiceSpy.get.and.returnValue(Promise.resolve([mockUser]));
      storageServiceSpy.getAllReviews.and.returnValue(Promise.resolve(reviews));
      
      await service.deleteAccount();
      
      expect(storageServiceSpy.set).toHaveBeenCalled();
      expect(storageServiceSpy.remove).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('isAuthenticated', () => {
    it('debería retornar true si hay usuario autenticado', async () => {
      storageServiceSpy.get.and.returnValue(Promise.resolve(mockUser));
      
      const result = await service.isAuthenticated();
      
      expect(result).toBe(true);
    });

    it('debería retornar false si no hay usuario autenticado', async () => {
      storageServiceSpy.get.and.returnValue(Promise.resolve(null));
      
      const result = await service.isAuthenticated();
      
      expect(result).toBe(false);
    });
  });
});

