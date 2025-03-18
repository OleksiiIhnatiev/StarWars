import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmsListComponent } from './films-list.component';
import { SwapiService } from '../../services/swapi/swapi.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading/loading.service';
import { of } from 'rxjs';
import { Film } from '../../models/film/film.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

describe('FilmsListComponent', () => {
  let component: FilmsListComponent;
  let fixture: ComponentFixture<FilmsListComponent>;
  let swapiServiceMock: jasmine.SpyObj<SwapiService>;
  let routerMock: jasmine.SpyObj<Router>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    swapiServiceMock = jasmine.createSpyObj('SwapiService', ['getMovies']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    loadingServiceMock = jasmine.createSpyObj('LoadingService', ['setLoading']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatProgressSpinnerModule, FilmsListComponent],
      providers: [
        { provide: SwapiService, useValue: swapiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmsListComponent);
    component = fixture.componentInstance;

    const films: Film[] = [
      {
        title: 'Film 1',
        episode_id: 1,
        opening_crawl: '',
        director: '',
        producer: '',
        release_date: '',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        url: 'https://swapi.dev/films/1',
      },
      {
        title: 'Film 2',
        episode_id: 2,
        opening_crawl: '',
        director: '',
        producer: '',
        release_date: '',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        url: 'https://swapi.dev/films/2',
      },
    ];
    swapiServiceMock.getMovies.and.returnValue(of({ results: films }));
    loadingServiceMock.setLoading.and.stub();

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load films on ngOnInit', () => {
    const films: Film[] = [
      {
        title: 'Film 1',
        episode_id: 1,
        opening_crawl: '',
        director: '',
        producer: '',
        release_date: '',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        url: 'https://swapi.dev/films/1',
      },
      {
        title: 'Film 2',
        episode_id: 2,
        opening_crawl: '',
        director: '',
        producer: '',
        release_date: '',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        url: 'https://swapi.dev/films/2',
      },
    ];

    swapiServiceMock.getMovies.and.returnValue(of({ results: films }));
    loadingServiceMock.setLoading.and.stub();

    component.ngOnInit();

    expect(component.films).toEqual(films);
    expect(loadingServiceMock.setLoading).toHaveBeenCalledWith(false);
  });

  it('should navigate to movie details on navigateToMovieDetails', () => {
    const movieId = 1;

    component.navigateToMovieDetails(movieId);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/film', movieId]);
  });

  it('should correctly extract movie ID from URL in getMovieId', () => {
    const url = 'https://swapi.dev/films/1/';

    const movieId = component.getMovieId(url);

    expect(movieId).toBe(1);
  });
});
