import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private baseUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/films/`).pipe(
      catchError((error) => {
        console.error('Ошибка при получении данных:', error);
        throw error;
      })
    );
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/films/${id}/`);
  }

  getCharacterDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/people/${id}/`);
  }
}
