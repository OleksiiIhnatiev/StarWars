import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmDetailsComponent } from './film-details.component';
import { SwapiService } from '../../services/swapi/swapi.service';
import { LoadingService } from '../../services/loading/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Film } from '../../models/film/film.model';
import { Character } from '../../models/character/character.model';
import { ImageSearchResponse } from '../../models/image/image.model';
import { ImageSearchService } from '../../services/image/image.search.service';

describe('FilmDetailsComponent', () => {
  let component: FilmDetailsComponent;
  let fixture: ComponentFixture<FilmDetailsComponent>;
  let swapiService: jasmine.SpyObj<SwapiService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let imageSearchService: jasmine.SpyObj<ImageSearchService>;
  let router: Router;

  beforeEach(async () => {
    const swapiSpy = jasmine.createSpyObj('SwapiService', [
      'getMovieDetails',
      'getCharacterByUrl',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    const imageSpy = jasmine.createSpyObj('ImageSearchService', ['getImages']);

    await TestBed.configureTestingModule({
      imports: [
        FilmDetailsComponent,
      ],
      providers: [
        { provide: SwapiService, useValue: swapiSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: ImageSearchService, useValue: imageSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmDetailsComponent);
    component = fixture.componentInstance;
    swapiService = TestBed.inject(SwapiService) as jasmine.SpyObj<SwapiService>;
    loadingService = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
    imageSearchService = TestBed.inject(
      ImageSearchService
    ) as jasmine.SpyObj<ImageSearchService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load film details on init', () => {
    const mockFilm: Film = {
      title: 'A New Hope',
      characters: ['https://swapi.dev/api/people/1/'],
    } as Film;
    const mockCharacter: Character = {
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
    } as Character;
    const mockImageResponse: ImageSearchResponse = {
      items: [{ link: 'image_url' }],
    } as ImageSearchResponse;

    swapiService.getMovieDetails.and.returnValue(of(mockFilm));
    swapiService.getCharacterByUrl.and.returnValue(of(mockCharacter));
    imageSearchService.getImages.and.returnValue(of(mockImageResponse));

    fixture.detectChanges();

    expect(swapiService.getMovieDetails).toHaveBeenCalledWith(1);
    expect(swapiService.getCharacterByUrl).toHaveBeenCalledWith(
      'https://swapi.dev/api/people/1/'
    );
    expect(imageSearchService.getImages).toHaveBeenCalledWith('A New Hope');
    expect(component.film).toEqual(mockFilm);
    expect(component.characters.length).toBe(1);
    expect(component.characterImages['Luke Skywalker']).toBe('image_url');
  });

  it('should navigate to character details', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateToCharacterDetails({
      name: 'Luke Skywalker',
      url: 'https://swapi.dev/api/people/1/',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/character/1']);
  });
});
