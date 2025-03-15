import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class MoviesListComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private swapiService: SwapiService,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.setLoading(true);

    this.swapiService.getMovies().subscribe((data: any) => {
      this.movies = data.results;
      this.loadingService.setLoading(false);
    });
  }

  getMovieId(url: string): number {
    return Number(url.split('/')[5]);
  }

  navigateToMovieDetails(id: number): void {
    this.router.navigate([`/movie/${id}`]);
  }
}
