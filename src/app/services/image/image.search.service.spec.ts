import { TestBed } from '@angular/core/testing';
import { ImageSearchService } from './image.search.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ImageSearchResponse } from '../../models/image/image.model';
import { environment } from '../../../environments/environment';

describe('ImageSearchService', () => {
  let service: ImageSearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageSearchService],
    });
    service = TestBed.inject(ImageSearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve images from the API', () => {
    const mockResponse: ImageSearchResponse = {
      items: [{ link: 'https://example.com/image.jpg' }],
    };

    const query = 'test query';

    service.getImages(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (req) => req.method === 'GET' && req.url === environment.imageApiUrl
    );
    expect(req.request.params.has('q')).toBeTrue();
    expect(req.request.params.get('q')).toBe(query);

    req.flush(mockResponse);
  });

  it('should cache the result after first API call', () => {
    const mockResponse: ImageSearchResponse = {
      items: [{ link: 'https://example.com/image.jpg' }],
    };

    const query = 'test query';

    service.getImages(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (req) => req.method === 'GET' && req.url === environment.imageApiUrl
    );
    req.flush(mockResponse);

    service.getImages(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    httpMock.expectNone(environment.imageApiUrl);
  });

  it('should handle errors gracefully', () => {
    const query = 'test query';
    const errorMessage = 'API error';

    service.getImages(query).subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(
      (req) => req.method === 'GET' && req.url === environment.imageApiUrl
    );
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
