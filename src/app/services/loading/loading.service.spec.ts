import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { take } from 'rxjs/operators';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should start with loading set to false', (done) => {
    service.loading$.pipe(take(1)).subscribe((loading) => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should set loading to true', (done) => {
    service.setLoading(true);

    service.loading$.pipe(take(1)).subscribe((loading) => {
      expect(loading).toBeTrue();
      done();
    });
  });

  it('should set loading to false', (done) => {
    service.setLoading(true);

    service.loading$.pipe(take(1)).subscribe((loading) => {
      expect(loading).toBeTrue();
      service.setLoading(false);
    });

    service.loading$.pipe(take(1)).subscribe((loading) => {
      expect(loading).toBeFalse();
      done();
    });
  });
});
