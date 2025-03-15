import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './components/movie-detail/movie-details.component';
import { CharacterDetailsComponent } from './components/character-detail/character-details.component';
import { AppComponent } from './app.component';
import { MoviesListComponent } from './components/movie-list/movies-list.component';

export const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'character/:id', component: CharacterDetailsComponent },
];
