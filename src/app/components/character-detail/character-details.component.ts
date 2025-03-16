import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageSearchService } from '../../services/image.search.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class CharacterDetailsComponent implements OnInit {
  character: any;
  films: any[] = [];
  filmImages: any = {};  // Добавляем объект для хранения картинок фильмов

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService,
    private imageSearchService: ImageSearchService  // Инжектируем ImageSearchService
  ) {}

  ngOnInit(): void {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      const id = Number(characterId);
      if (!isNaN(id)) {
        this.loadingService.setLoading(true);

        this.swapiService.getCharacterDetails(id).subscribe((data: any) => {
          this.character = data;

          const filmRequests = data.films.map((url: string) =>
            this.swapiService.getMovieByUrl(url).then((film) => ({
              title: film.title,
              url: url,
            }))
          );

          Promise.all(filmRequests).then((filmsData) => {
            this.films = filmsData;

            // Для каждого фильма получаем изображение
            filmsData.forEach((film) => {
              this.imageSearchService.getImages(film.title).subscribe((response: any) => {
                if (response.items && response.items.length > 0) {
                  // Сохраняем картинку для каждого фильма в объекте
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
