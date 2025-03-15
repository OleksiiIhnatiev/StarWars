import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class CharacterDetailsComponent implements OnInit {
  character: any;
  movies: any[] = [];

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      const id = Number(characterId);
      if (!isNaN(id)) {
        this.loadingService.setLoading(true);

        this.swapiService.getCharacterDetails(id).subscribe((data: any) => {
          this.character = data;

          const movieRequests = data.films.map((url: string) =>
            this.swapiService.getMovieByUrl(url).then((movie) => ({
              title: movie.title,
              url: url,
            }))
          );

          Promise.all(movieRequests).then((moviesData) => {
            this.movies = moviesData;
            this.loadingService.setLoading(false);
          });
        });
      } else {
        console.error('Invalid character ID');
      }
    }
  }

  navigateToMovieDetails(url: string): void {
    const movieId = url.split('/')[5];
    const id = Number(movieId);
    if (!isNaN(id)) {
      this.router.navigate([`/movie/${id}`]);
    } else {
      console.error('Invalid movie ID');
    }
  }
}
