import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css'],
  imports: [CommonModule],
})
export class CharacterDetailsComponent implements OnInit {
  character: any;
  movies: any[] = [];

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      const id = Number(characterId);
      if (!isNaN(id)) {
        this.swapiService.getCharacterDetails(id).subscribe((data: any) => {
          this.character = data;
          this.movies = data.films;
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
