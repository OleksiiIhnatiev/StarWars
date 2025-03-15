import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from '../../services/swapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
  imports: [CommonModule],
})
export class MoviesListComponent implements OnInit {
  movies: any[] = [];

  constructor(private swapiService: SwapiService, private router: Router) {}

  ngOnInit(): void {
    this.swapiService.getMovies().subscribe((data: any) => {
      this.movies = data.results;
    });
  }

  getMovieId(url: string): number {
    return Number(url.split('/')[5]);
  }

  navigateToMovieDetails(id: number): void {
    this.router.navigate([`/movie/${id}`]);
  }
}
