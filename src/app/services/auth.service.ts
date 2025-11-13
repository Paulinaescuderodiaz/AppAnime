import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$: Observable<boolean>;

  constructor(private storageService: StorageService) {
    this.isAuthenticated$ = this.currentUser$.pipe(
      map(user => user !== null)
    );
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    const user = await this.storageService.get('currentUser');
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Login con Email y Contraseña (SQLite)
  async loginWithEmail(email: string, password: string): Promise<any> {
    try {
      // Obtener usuarios registrados
      const users = await this.storageService.get('users') || [];
      
      // Buscar usuario
      const user = users.find((u: any) => 
        u.email === email && u.password === password
      );

      if (user) {
        // Guardar sesión
        const sessionUser: User = {
          uid: user.uid,
          id: user.uid,
          email: user.email,
          displayName: user.fullName,
          fullName: user.fullName,
          photoURL: null,
          authProvider: 'Email',
          createdAt: user.createdAt
        };
        
        await this.storageService.set('currentUser', sessionUser);
        this.currentUserSubject.next(sessionUser);
        
        return { success: true, user: sessionUser };
      } else {
        return { success: false, message: 'Credenciales incorrectas' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error al iniciar sesión' };
    }
  }

  // Registro con Email y Contraseña (SQLite)
  async registerWithEmail(email: string, password: string, fullName: string): Promise<any> {
    try {
      // Obtener usuarios existentes
      const users = await this.storageService.get('users') || [];
      
      // Verificar si el email ya existe
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        return { success: false, message: 'Este email ya está registrado' };
      }

      // Crear nuevo usuario
      const newUser = {
        uid: `user_${Date.now()}`,
        email,
        password, // En producción deberías hashear la contraseña
        fullName,
        createdAt: new Date().toISOString(),
        authProvider: 'Email'
      };

      // Guardar usuario
      users.push(newUser);
      await this.storageService.set('users', users);

      // Crear sesión
      const sessionUser: User = {
        uid: newUser.uid,
        id: newUser.uid,
        email: newUser.email,
        displayName: newUser.fullName,
        fullName: newUser.fullName,
        photoURL: null,
        authProvider: 'Email',
        createdAt: newUser.createdAt
      };

      await this.storageService.set('currentUser', sessionUser);
      this.currentUserSubject.next(sessionUser);

      return { success: true, user: sessionUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Error al registrar usuario' };
    }
  }

  // Login con Google (Simulado para desarrollo)
  async loginWithGoogle(): Promise<any> {
    try {
      // Simulación de login con Google
      // En producción, usar Firebase Authentication
      const googleUser: User = {
        uid: `google_${Date.now()}`,
        id: `google_${Date.now()}`,
        email: 'usuario@gmail.com',
        displayName: 'Usuario Google',
        fullName: 'Usuario Google',
        photoURL: 'https://ui-avatars.com/api/?name=Usuario+Google&background=667eea&color=fff',
        authProvider: 'Google',
        createdAt: new Date().toISOString()
      };

      await this.storageService.set('currentUser', googleUser);
      this.currentUserSubject.next(googleUser);

      return { success: true, user: googleUser };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: 'Error al iniciar sesión con Google' };
    }
  }

  // Actualizar contraseña
  async updatePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      const currentUser = this.currentUserSubject.value;
      if (!currentUser || currentUser.authProvider === 'Google') {
        return { success: false, message: 'No se puede cambiar la contraseña de una cuenta de Google' };
      }

      const users = await this.storageService.get('users') || [];
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);

      if (userIndex === -1) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      // Verificar contraseña actual
      if (users[userIndex].password !== currentPassword) {
        return { success: false, message: 'Contraseña actual incorrecta' };
      }

      // Actualizar contraseña
      users[userIndex].password = newPassword;
      await this.storageService.set('users', users);

      return { success: true, message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, message: 'Error al actualizar contraseña' };
    }
  }

  // Actualizar perfil
  async updateProfile(updates: { fullName?: string }): Promise<any> {
    try {
      const currentUser = this.currentUserSubject.value;
      if (!currentUser) {
        return { success: false, message: 'No hay usuario autenticado' };
      }

      // Actualizar en la lista de usuarios
      const users = await this.storageService.get('users') || [];
      const userIndex = users.findIndex((u: any) => u.uid === currentUser.uid);

      if (userIndex !== -1) {
        if (updates.fullName) {
          users[userIndex].fullName = updates.fullName;
          await this.storageService.set('users', users);
        }
      }

      // Actualizar usuario actual
      const updatedUser: User = {
        ...currentUser,
        fullName: updates.fullName || currentUser.fullName,
        displayName: updates.fullName || currentUser.displayName
      };

      await this.storageService.set('currentUser', updatedUser);
      this.currentUserSubject.next(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Error al actualizar el perfil' };
    }
  }

  // Cambiar contraseña (alias para updatePassword)
  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    return this.updatePassword(currentPassword, newPassword);
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    await this.storageService.remove('currentUser');
    this.currentUserSubject.next(null);
  }

  // Eliminar cuenta
  async deleteAccount(): Promise<void> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      // Eliminar usuario de la lista
      const users = await this.storageService.get('users') || [];
      const filteredUsers = users.filter((u: any) => u.uid !== currentUser.uid);
      await this.storageService.set('users', filteredUsers);

      // Eliminar reseñas del usuario
      const reviews = await this.storageService.getAllReviews();
      const filteredReviews = reviews.filter((r: any) => r.userId !== currentUser.uid);
      await this.storageService.set('reviews', filteredReviews);

      // Cerrar sesión
      await this.logout();
    }
  }

  // Verificar si hay sesión activa (método legacy para compatibilidad)
  async isAuthenticated(): Promise<boolean> {
    const user = await this.storageService.get('currentUser');
    return user !== null;
  }
}
