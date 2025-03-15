import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  characters: any[] = [];

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      const id = Number(movieId);
      if (!isNaN(id)) {
        this.loadingService.setLoading(true);

        this.swapiService.getMovieDetails(id).subscribe((data: any) => {
          this.movie = data;

          const characterRequests = data.characters.map((url: string) =>
            this.swapiService.getCharacterByUrl(url).then((char) => ({
              name: char.name,
              url: url,
            }))
          );

          Promise.all(characterRequests).then((charactersData) => {
            this.characters = charactersData;
            this.loadingService.setLoading(false);
          });
        });
      } else {
        console.error('Invalid movie ID');
      }
    }
  }

  navigateToCharacterDetails(character: { name: string; url: string }): void {
    const characterId = character.url.split('/')[5]; // получаем ID из URL
    this.router.navigate([`/character/${characterId}`]);
  }
}
