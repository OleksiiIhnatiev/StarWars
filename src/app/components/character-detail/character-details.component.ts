import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageSearchService } from '../../services/image.search.service';
import { Character } from '../../models/character/character.model';
import { ImageSearchResponse } from '../../models/image/image.model';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class CharacterDetailsComponent implements OnInit {
  character: Character | null = null;
  films: { title: string; url: string }[] = [];
  filmImages: Record<string, string> = {};
  characterImages: Record<string, string> = {};

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService,
    private imageSearchService: ImageSearchService
  ) {}

  ngOnInit(): void {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      const id = Number(characterId);
      if (!isNaN(id)) {
        this.loadingService.setLoading(true);

        this.swapiService
          .getCharacterDetails(id)
          .subscribe((data: Character) => {
            this.character = data;

            this.imageSearchService
              .getImages(this.character?.name ?? '')
              .subscribe((response: ImageSearchResponse) => {
                if (response.items?.length) {
                  this.characterImages[this.character!.name] =
                    response.items[0].link;
                }
              });

            const filmRequests = data.films.map((url: string) =>
              this.swapiService.getMovieByUrl(url).then((film) => ({
                title: film.title,
                url: url,
              }))
            );

            Promise.all(filmRequests).then((filmsData) => {
              this.films = filmsData;

              filmsData.forEach((film) => {
                this.imageSearchService
                  .getImages(film.title)
                  .subscribe((response: ImageSearchResponse) => {
                    if (response.items && response.items.length > 0) {
                      this.filmImages[film.title] = response.items[0].link;
                    }
                  });
              });

              this.loadingService.setLoading(false);
            });
          });
      } else {
        console.error('Invalid character ID');
      }
    }
  }

  navigateToMovieDetails(film: { title: string; url: string }): void {
    const filmId = film.url.split('/')[5];
    this.router.navigate([`/film/${filmId}`]);
  }
}
