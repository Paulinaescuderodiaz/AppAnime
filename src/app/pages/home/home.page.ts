import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Anime } from '../../models/anime.model';
import { Review } from '../../models/review.model';
import { User } from '../../models/user.model';
import { AnimeService } from '../../services/anime.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  topAnimes: Anime[] = [];
  reviews: { [animeId: number]: Review[] } = {};
  currentUser: User | null = null;
  isLoading: boolean = true;

  constructor(
    private animeService: AnimeService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    this.animeService.getTopAnimes(10).subscribe({
      next: (animes) => {
        this.topAnimes = animes;
        this.loadReviews();
      },
      error: (error) => {
        console.error('Error cargando animes:', error);
        this.isLoading = false;
        this.showAlert('Error', 'No se pudieron cargar los animes');
      }
    });
  }

  loadReviews() {
    this.topAnimes.forEach(anime => {
      this.reviewService.getReviewsByAnime(anime.mal_id).subscribe({
        next: (reviews) => {
          this.reviews[anime.mal_id] = reviews;
        }
      });
    });
    this.isLoading = false;
  }

  async refreshData(event: any) {
    await this.loadData();
    if (event && event.detail) {
      event.detail.complete();
    } else if (event && event.target) {
      event.target.complete();
    }
  }

  viewAnimeDetail(anime: Anime) {
    this.router.navigate(['/anime-detail', anime.mal_id]);
  }

  async addReview(anime: Anime) {
    if (!this.currentUser) {
      this.showAlert('Error', 'Debes iniciar sesión para dejar una reseña');
      return;
    }

    const userId = this.currentUser.id || this.currentUser.uid || '';
    if (!userId) {
      this.showAlert('Error', 'Error al obtener información del usuario');
      return;
    }

    const hasReviewed = await this.reviewService.hasUserReviewed(
      userId,
      anime.mal_id
    );

    if (hasReviewed) {
      this.showAlert('Info', 'Ya has dejado una reseña para este anime');
      return;
    }

    const alert = await this.alertController.create({
      header: `Reseña de ${anime.title}`,
      inputs: [
        {
          name: 'rating',
          type: 'number',
          placeholder: 'Calificación (1-10)',
          min: 1,
          max: 10
        },
        {
          name: 'comment',
          type: 'textarea',
          placeholder: 'Escribe tu comentario...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Publicar',
          handler: (data) => {
            this.submitReview(anime, data.rating, data.comment);
          }
        }
      ]
    });

    await alert.present();
  }

  async submitReview(anime: Anime, rating: string, comment: string) {
    if (!rating || !comment) {
      this.showAlert('Error', 'Por favor completa todos los campos');
      return;
    }

    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 10) {
      this.showAlert('Error', 'La calificación debe estar entre 1 y 10');
      return;
    }

    const userId = this.currentUser!.id || this.currentUser!.uid || '';
    if (!userId) {
      this.showAlert('Error', 'Error al obtener información del usuario');
      return;
    }

    const review: Review = {
      animeId: anime.mal_id,
      animeName: anime.title,
      userId: userId,
      userEmail: this.currentUser!.email,
      userName: this.currentUser!.fullName,
      rating: ratingNum,
      comment: comment.trim(),
      createdAt: new Date()
    };

    const loading = await this.loadingController.create({
      message: 'Publicando reseña...'
    });
    await loading.present();

    this.reviewService.saveReview(review).subscribe({
      next: () => {
        loading.dismiss();
        this.showAlert('¡Listo!', 'Tu reseña ha sido publicada');
        this.loadReviews();
      },
      error: () => {
        loading.dismiss();
        this.showAlert('Error', 'No se pudo publicar la reseña');
      }
    });
  }

  getAnimeReviews(animeId: number): Review[] {
    return this.reviews[animeId] || [];
  }

  getAverageRating(animeId: number): number {
    const animeReviews = this.getAnimeReviews(animeId);
    return this.animeService.calculateAverageRating(animeReviews);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getSynopsisPreview(synopsis: string | undefined): string {
    if (!synopsis) {
      return 'Sin sinopsis disponible';
    }
    if (synopsis.length > 150) {
      return synopsis.substring(0, 150) + '...';
    }
    return synopsis;
  }
}
