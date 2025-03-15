import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
  imports: [CommonModule],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  characters: any[] = [];

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      const id = Number(movieId);
      if (!isNaN(id)) {
        this.swapiService.getMovieDetails(id).subscribe((data: any) => {
          this.movie = data;
          this.characters = data.characters;
        });
      } else {
        console.error('Invalid movie ID');
      }
    }
  }

  navigateToCharacterDetails(url: string): void {
    const characterId = url.split('/')[5];
    this.router.navigate([`/character/${characterId}`]);
  }
}
