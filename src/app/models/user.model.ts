export interface User {
  id?: string;
  uid?: string;
  email: string;
  fullName: string;
  displayName?: string;
  photoURL?: string | null;
  authProvider?: 'Email' | 'Google';
  createdAt?: string;
  password?: string; // Solo para registro, no debería persistirse en sesión
}

