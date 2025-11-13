import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  // Registro con email y contraseña
  async register() {
    if (!this.validateForm()) {
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
      await loading.dismiss();
      if (result.success) {
        await this.showAlert(
          '¡Cuenta creada!',
          'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.'
        );
        this.router.navigate(['/login']);
      } else {
        await this.showAlert('Error', result.message || 'No se pudo crear la cuenta');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert('Error', error?.message || 'No se pudo crear la cuenta');
    }
  }

  // Registro con Google
  async registerWithGoogle() {
    const loading = await this.loadingController.create({
      message: 'Conectando con Google...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const result = await this.authService.loginWithGoogle();
      await loading.dismiss();
      if (result.success) {
        await this.showAlert('¡Bienvenido!', `Hola ${result.user.fullName}`);
        this.router.navigate(['/home']);
      } else {
        await this.showAlert('Error', result.message || 'No se pudo conectar con Google');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert('Error', 'No se pudo conectar con Google');
    }
  }

  // Ir a login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Validar formulario
  private validateForm(): boolean {
    if (!this.registerData.fullName || !this.registerData.email || 
        !this.registerData.password || !this.registerData.confirmPassword) {
      this.showAlert('Error', 'Por favor completa todos los campos');
      return false;
    }

    if (this.registerData.fullName.trim().length < 3) {
      this.showAlert('Error', 'El nombre debe tener al menos 3 caracteres');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.registerData.email)) {
      this.showAlert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    if (this.registerData.password.length < 6) {
      this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  }

  // Toggle visibilidad de contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Toggle visibilidad de confirmación de contraseña
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Mostrar alerta
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
