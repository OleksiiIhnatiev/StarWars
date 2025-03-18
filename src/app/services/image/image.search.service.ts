import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { ImageSearchResponse } from '../../models/image/image.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageSearchService {
  private imageUrl = environment.imageApiUrl;
  private apiKey = environment.API_KEY;
  private cx = environment.CX;

  private imageCache: Map<string, ImageSearchResponse> = new Map();

  constructor(private http: HttpClient) {}

  getImages(query: string): Observable<ImageSearchResponse> {
    if (this.imageCache.has(query)) {
      return of(this.imageCache.get(query)!);
    }

    const params = new HttpParams()
      .set('q', query)
      .set('key', this.apiKey)
      .set('cx', this.cx)
      .set('searchType', 'image')
      .set('num', '10');

    return this.http.get<ImageSearchResponse>(this.imageUrl, { params }).pipe(
      tap((response) => {
        this.imageCache.set(query, response);
      })
    );
  }
}
