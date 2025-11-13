import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser: User | null = null;
  fullName: string = '';
  email: string = '';
  isEditing: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.fullName = user.fullName;
          this.email = user.email;
        }
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserData();
    }
  }

  async saveProfile() {
    if (!this.fullName.trim()) {
      this.showAlert('Error', 'El nombre no puede estar vacío');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando cambios...'
    });
    await loading.present();

    try {
      const result = await this.authService.updateProfile({ fullName: this.fullName });
      await loading.dismiss();
      if (result.success) {
        this.isEditing = false;
        this.showAlert('¡Listo!', 'Perfil actualizado correctamente');
      } else {
        this.showAlert('Error', result.message || 'No se pudo actualizar el perfil');
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showAlert('Error', 'No se pudo actualizar el perfil');
    }
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Contraseña actual'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nueva contraseña'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: (data) => {
            this.processPasswordChange(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async processPasswordChange(data: any) {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      this.showAlert('Error', 'Completa todos los campos');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (data.newPassword.length < 6) {
      this.showAlert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cambiando contraseña...'
    });
    await loading.present();

    try {
      const result = await this.authService.changePassword(data.currentPassword, data.newPassword);
      await loading.dismiss();
      if (result.success) {
        this.showAlert('¡Listo!', 'Contraseña actualizada correctamente');
      } else {
        this.showAlert('Error', result.message || 'No se pudo cambiar la contraseña');
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showAlert('Error', error?.message || 'No se pudo cambiar la contraseña');
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, cerrar sesión',
          handler: () => {
            this.confirmLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmLogout() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...'
    });
    await loading.present();

    try {
      await this.authService.logout();
      await loading.dismiss();
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error: any) {
      await loading.dismiss();
      this.showAlert('Error', 'No se pudo cerrar sesión');
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
