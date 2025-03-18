import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterDetailsComponent } from './character-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SwapiService } from '../../services/swapi/swapi.service';
import { LoadingService } from '../../services/loading/loading.service';
import { Character } from '../../models/character/character.model';
import { Film } from '../../models/film/film.model';
import { ImageSearchResponse } from '../../models/image/image.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageSearchService } from '../../services/image/image.search.service';

describe('CharacterDetailsComponent', () => {
  let component: CharacterDetailsComponent;
  let fixture: ComponentFixture<CharacterDetailsComponent>;
  let swapiServiceSpy: jasmine.SpyObj<SwapiService>;
  let imageSearchServiceSpy: jasmine.SpyObj<ImageSearchService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let routerSpy: jasmine.SpyObj<Router>;
  
  beforeEach(async () => {
    const swapiServiceMock = jasmine.createSpyObj('SwapiService', ['getCharacterDetails', 'getMovieByUrl']);
    const imageSearchServiceMock = jasmine.createSpyObj('ImageSearchService', ['getImages']);
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', ['setLoading']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CharacterDetailsComponent, MatProgressSpinnerModule],
      providers: [
        { provide: SwapiService, useValue: swapiServiceMock },
        { provide: ImageSearchService, useValue: imageSearchServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterDetailsComponent);
    component = fixture.componentInstance;
    swapiServiceSpy = TestBed.inject(SwapiService) as jasmine.SpyObj<SwapiService>;
    imageSearchServiceSpy = TestBed.inject(ImageSearchService) as jasmine.SpyObj<ImageSearchService>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load character details on init', () => {
    const mockCharacter: Character = { name: 'Luke Skywalker', films: ['film-url'] } as Character;
    const mockFilm: Film = { title: 'A New Hope', url: 'film-url' } as Film;
    const mockImageResponse: ImageSearchResponse = { items: [{ link: 'image-url' }] } as ImageSearchResponse;

    swapiServiceSpy.getCharacterDetails.and.returnValue(of(mockCharacter));
    swapiServiceSpy.getMovieByUrl.and.returnValue(of(mockFilm));
    imageSearchServiceSpy.getImages.and.returnValue(of(mockImageResponse));
    
    component.ngOnInit();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(swapiServiceSpy.getCharacterDetails).toHaveBeenCalledWith(1);
    expect(imageSearchServiceSpy.getImages).toHaveBeenCalledWith('Luke Skywalker');
    expect(swapiServiceSpy.getMovieByUrl).toHaveBeenCalledWith('film-url');
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should navigate to movie details when navigateToMovieDetails is called', () => {
    component.navigateToMovieDetails({ title: 'A New Hope', url: 'https://swapi.dev/api/films/1/' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/film/1']);
  });
});
