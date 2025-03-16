import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from './services/swapi.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  films: any[] = [];

  constructor(private swapiService: SwapiService, private router: Router) {}

  ngOnInit(): void {
    this.swapiService.getMovies().subscribe((data: any) => {
      this.films = data.results;
    });
  }

  getMovieId(url: string): number {
    return Number(url.split('/')[5]);
  }

  navigateToMovieDetails(id: number): void {
    this.router.navigate([`/film/${id}`]);
  }
}
