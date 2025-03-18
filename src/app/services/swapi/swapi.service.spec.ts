import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SwapiService } from './swapi.service';
import { Film } from '../../models/film/film.model';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;
  const swapiUrl = 'https://swapi.dev/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SwapiService],
    });

    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMovies', () => {
    it('should return a list of films', () => {
      const mockFilms: { results: Film[] } = {
        results: [
          {
            title: 'A New Hope',
            opening_crawl: 'Some text',
            director: 'George Lucas',
            producer: 'Gary Kurtz',
            release_date: '1977-05-25',
            episode_id: 1,
            planets: ['https://swapi.dev/api/planets/1/'],
            starships: ['https://swapi.dev/api/starships/1/'],
            vehicles: ['https://swapi.dev/api/vehicles/1/'],
            species: ['https://swapi.dev/api/species/1/'],
            characters: [
              'https://swapi.dev/api/people/1/',
              'https://swapi.dev/api/people/2/',
            ],
            url: 'https://swapi.dev/api/films/1/',
          },
        ],
      };

      service.getMovies().subscribe((data) => {
        expect(data.results.length).toBe(1);
        expect(data.results[0].title).toBe('A New Hope');
      });

      const req = httpMock.expectOne(`${swapiUrl}/films/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFilms);
    });
  });

  describe('getMovieByUrl', () => {
    it('should return a film from the cache or API', () => {
      const mockFilm: Film = {
        title: 'The Empire Strikes Back',
        opening_crawl: 'Some text',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz',
        release_date: '1980-05-21',
        episode_id: 2,
        planets: ['https://swapi.dev/api/planets/2/'],
        starships: ['https://swapi.dev/api/starships/2/'],
        vehicles: ['https://swapi.dev/api/vehicles/2/'],
        species: ['https://swapi.dev/api/species/2/'],
        characters: ['https://swapi.dev/api/people/1/'],
        url: 'https://swapi.dev/api/films/2/',
      };

      service
        .getMovieByUrl('https://swapi.dev/api/films/2/')
        .subscribe((data) => {
          expect(data.title).toBe('The Empire Strikes Back');
        });

      const req = httpMock.expectOne('https://swapi.dev/api/films/2/');
      expect(req.request.method).toBe('GET');
      req.flush(mockFilm);
    });

    it('should return a cached film if available', () => {
      const mockFilm: Film = {
        title: 'The Return of the Jedi',
        opening_crawl: 'Some text',
        director: 'Richard Marquand',
        producer: 'Howard G. Kazanjian',
        release_date: '1983-05-25',
        episode_id: 3,
        planets: ['https://swapi.dev/api/planets/3/'],
        starships: ['https://swapi.dev/api/starships/3/'],
        vehicles: ['https://swapi.dev/api/vehicles/3/'],
        species: ['https://swapi.dev/api/species/3/'],
        characters: ['https://swapi.dev/api/people/1/'],
        url: 'https://swapi.dev/api/films/3/',
      };

      service['movieCache'].set(3, mockFilm);

      service
        .getMovieByUrl('https://swapi.dev/api/films/3/')
        .subscribe((data) => {
          expect(data.title).toBe('The Return of the Jedi');
        });

      const req = httpMock.expectNone('https://swapi.dev/api/films/3/');
    });
  });
});
