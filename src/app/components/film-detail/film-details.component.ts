import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi/swapi.service';
import { LoadingService } from '../../services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Film } from '../../models/film/film.model';
import { ImageSearchResponse } from '../../models/image/image.model';
import { forkJoin } from 'rxjs';
import { Character } from '../../models/character/character.model';
import { ImageSearchService } from '../../services/image/image.search.service';

@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  styleUrls: ['./film-details.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class FilmDetailsComponent implements OnInit {
  film: Film | null = null;
  characters: { name: string; url: string }[] = [];
  characterImages: Record<string, string> = {};
  filmImageUrl: string | null = null;

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService,
    private imageSearchService: ImageSearchService
  ) {}

  ngOnInit(): void {
    const filmId = this.route.snapshot.paramMap.get('id');
    if (filmId) {
      const id = Number(filmId);
      if (!isNaN(id)) {
        this.loadingService.setLoading(true);

        this.swapiService.getMovieDetails(id).subscribe({
          next: (data: Film) => {
            this.film = data;

            if (this.film) {
              this.imageSearchService
                .getImages(this.film.title)
                .subscribe((response: ImageSearchResponse) => {
                  if (response.items?.length) {
                    this.filmImageUrl = response.items[0].link;
                  }
                });

              const characterRequests = this.film.characters.map(
                (url: string) => this.swapiService.getCharacterByUrl(url)
              );

              forkJoin(characterRequests).subscribe({
                next: (charactersData: Character[]) => {
                  this.characters = charactersData.map((char) => ({
                    name: char.name,
                    url: char.url,
                  }));

                  this.characters.forEach((character) => {
                    this.imageSearchService
                      .getImages(character.name)
                      .subscribe((response: ImageSearchResponse) => {
                        if (response.items?.length) {
                          this.characterImages[character.name] =
                            response.items[0].link;
                        }
                      });
                  });

                  this.loadingService.setLoading(false);
                },
                error: (err) => {
                  console.error('Ошибка при загрузке персонажей:', err);
                  this.loadingService.setLoading(false);
                },
              });
            }
          },
          error: (err) => {
            console.error('Ошибка загрузки фильма:', err);
            this.loadingService.setLoading(false);
          },
        });
      } else {
        console.error('Invalid film ID');
      }
    }
  }

  navigateToCharacterDetails(character: { name: string; url: string }): void {
    const characterId = character.url.split('/')[5];
    this.router.navigate([`/character/${characterId}`]);
  }
}
