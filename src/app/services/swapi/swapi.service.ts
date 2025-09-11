import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Character } from '../../models/character/character.model';
import { Film } from '../../models/film/film.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private swapiUrl = environment.swapiUrl;
  private movieCache: Map<number, Film> = new Map();
  private characterCache: Map<number, Character> = new Map();

  constructor(private http: HttpClient) {}

getMovies(): Observable<Film[]> {
  return this.http.get<Film[]>(`${this.swapiUrl}/films`);
}

  getMovieByUrl(url: string): Observable<Film> {
    const filmId = url.split('/')[5];

    if (this.movieCache.has(Number(filmId))) {
      return of(this.movieCache.get(Number(filmId))!);
    }

    return this.http.get<Film>(url).pipe(
      catchError((error) => {
        console.error(`Error loading movie by URL ${url}:`, error);
        throw error;
      })
    );
  }

  getMovieDetails(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.swapiUrl}/films/${id}`);
  }

  getCharacterByUrl(url: string): Observable<Character> {
    const characterId = url.split('/')[5];

    if (this.characterCache.has(Number(characterId))) {
      return of(this.characterCache.get(Number(characterId))!);
    }

    return this.http.get<Character>(url).pipe(
      catchError((error) => {
        console.error(`Error loading character by URL ${url}:`, error);
        throw error;
      })
    );
  }

  getCharacterDetails(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.swapiUrl}/people/${id}`);
  }
}
