import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './components/film-detail/film-details.component';
import { CharacterDetailsComponent } from './components/character-detail/character-details.component';
import { AppComponent } from './app.component';
import { MoviesListComponent } from './components/film-list/films-list.component';

export const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'film/:id', component: MovieDetailsComponent },
  { path: 'character/:id', component: CharacterDetailsComponent },
];
