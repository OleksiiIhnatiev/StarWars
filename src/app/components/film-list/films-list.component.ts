import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from '../../services/swapi/swapi.service';
import { LoadingService } from '../../services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Film } from '../../models/film/film.model';

@Component({
  selector: 'app-films-list',
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class FilmsListComponent implements OnInit {
  films: Film[] = [];

  constructor(
    private swapiService: SwapiService,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.setLoading(true);

this.swapiService.getMovies().subscribe({
  next: (data: Film[]) => {
    this.films = data;
    this.loadingService.setLoading(false);
  },
      error: (error) => {
        console.error('Failed to load films:', error);
        this.loadingService.setLoading(false);
      },
    });
  }

getMovieId(url: string): number {
  const match = url.match(/\/films\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}


  navigateToMovieDetails(id: number): void {
    this.router.navigate([`/film`, id]);
  }
}
