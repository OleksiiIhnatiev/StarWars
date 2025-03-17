import { Routes } from '@angular/router';
import { FilmDetailsComponent } from './components/film-detail/film-details.component';
import { CharacterDetailsComponent } from './components/character-detail/character-details.component';
import { AppComponent } from './app.component';
import { FilmsListComponent } from './components/film-list/films-list.component';

export const routes: Routes = [
  { path: '', component: FilmsListComponent },
  { path: 'film/:id', component: FilmDetailsComponent },
  { path: 'character/:id', component: CharacterDetailsComponent },
];
