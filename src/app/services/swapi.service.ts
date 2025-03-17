import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { Character } from '../models/character/character.model';
import { Film } from '../models/film/film.model';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private baseUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<{ results: Film[] }> {
    return this.http.get<{ results: Film[] }>(`${this.baseUrl}/films/`).pipe(
      catchError((error) => {
        console.error('Error fetching data:', error);
        throw error;
      })
    );
  }

  getMovieDetails(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.baseUrl}/films/${id}/`);
  }

  async getCharacterByUrl(url: string): Promise<Character> {
    try {
      const response = await firstValueFrom(this.http.get<Character>(url));
      if (!response) {
        throw new Error('Character not found');
      }
      return response;
    } catch (error) {
      console.error(`Error loading character by URL ${url}:`, error);
      throw error;
    }
  }

  async getMovieByUrl(url: string): Promise<Film> {
    try {
      const response = await firstValueFrom(this.http.get<Film>(url));
      if (!response) {
        throw new Error('Movie not found');
      }
      return response;
    } catch (error) {
      console.error(`Error loading movie by URL ${url}:`, error);
      throw error;
    }
  }

  getCharacterDetails(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/people/${id}/`);
  }
}
