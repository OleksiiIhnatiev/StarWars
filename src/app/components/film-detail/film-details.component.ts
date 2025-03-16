import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageSearchService } from '../../services/image.search.service';

@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  styleUrls: ['./film-details.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class MovieDetailsComponent implements OnInit {
  film: any;
  characters: any[] = [];
  characterImages: any = {};  // Добавляем объект для хранения картинок персонажей

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService,
    private imageSearchService: ImageSearchService  // Инжектируем ImageSearchService
  ) {}

  ngOnInit(): void {
    const filmId = this.route.snapshot.paramMap.get('id');
    if (filmId) {
      const id = Number(filmId);
      if (!isNaN(id)) {
        this.loadingService.setLoading(true);

        this.swapiService.getMovieDetails(id).subscribe((data: any) => {
          this.film = data;

          const characterRequests = data.characters.map((url: string) =>
            this.swapiService.getCharacterByUrl(url).then((char) => ({
              name: char.name,
              url: url,
            }))
          );

          Promise.all(characterRequests).then((charactersData) => {
            this.characters = charactersData;

            // Для каждого персонажа получаем изображение по его имени
            charactersData.forEach((character) => {
              this.imageSearchService.getImages(character.name).subscribe((response: any) => {
                if (response.items && response.items.length > 0) {
                  // Сохраняем картинку для каждого персонажа в объекте
                  this.characterImages[character.name] = response.items[0].link;
                }
              });
            });

            this.loadingService.setLoading(false);
          });
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
