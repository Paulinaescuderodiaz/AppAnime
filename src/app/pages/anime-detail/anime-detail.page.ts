import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Anime } from '../../models/anime.model';
import { AnimeService } from '../../services/anime.service';

@Component({
  selector: 'app-anime-detail',
  templateUrl: './anime-detail.page.html',
  styleUrls: ['./anime-detail.page.scss'],
})
export class AnimeDetailPage implements OnInit {
  anime: Anime | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animeService: AnimeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnime(parseInt(id));
    }
  }

  loadAnime(id: number) {
    this.animeService.getAnimeById(id).subscribe({
      next: (anime) => {
        this.anime = anime;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
