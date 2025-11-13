import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  segmentValue: string = 'login';
  showPassword: boolean = false;

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.checkExistingSession();
  }

  async checkExistingSession() {
    const currentUser = await this.storageService.get('currentUser');
    if (currentUser) {
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.loginData.email || !this.loginData.password) {
      await this.showAlert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!this.isValidEmail(this.loginData.email)) {
      await this.showAlert('Error', 'Por favor ingresa un email válido');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const result = await this.authService.loginWithEmail(
        this.loginData.email,
        this.loginData.password
      );

      if (result.success) {
        await loading.dismiss();
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        await loading.dismiss();
        await this.showAlert('Error', result.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', 'Ocurrió un error al iniciar sesión');
    }
  }

  async register() {
    if (!this.registerData.fullName || !this.registerData.email || 
        !this.registerData.password || !this.registerData.confirmPassword) {
      await this.showAlert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!this.isValidEmail(this.registerData.email)) {
      await this.showAlert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (this.registerData.password.length < 8) {
      await this.showAlert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const result = await this.authService.registerWithEmail(
        this.registerData.email,
        this.registerData.password,
        this.registerData.fullName
      );

      if (result.success) {
        await loading.dismiss();
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        await loading.dismiss();
        await this.showAlert('Error', result.message || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', 'Ocurrió un error al registrarse');
    }
  }

  async loginWithGoogle() {
    const loading = await this.loadingController.create({
      message: 'Conectando con Google...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const result = await this.authService.loginWithGoogle();

      if (result.success) {
        await loading.dismiss();
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        await loading.dismiss();
        await this.showAlert('Error', result.message || 'No se pudo iniciar sesión con Google');
      }
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', 'Ocurrió un error al conectar con Google');
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
