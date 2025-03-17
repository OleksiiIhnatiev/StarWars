import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageSearchResponse } from '../models/image/image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageSearchService {
  private apiUrl = 'https://www.googleapis.com/customsearch/v1';
  private apiKey = 'AIzaSyDB6pM2LFWMcrx-nknuIAenhQPN77X7OCc';
  private cx = 'c32ab2a338c33401b';

  constructor(private http: HttpClient) {}

  getImages(query: string): Observable<ImageSearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('key', this.apiKey)
      .set('cx', this.cx)
      .set('searchType', 'image')
      .set('num', '10');

    return this.http.get<ImageSearchResponse>(this.apiUrl, { params });
  }
}
