# Star Wars Movie Explorer

## Overview
This is a single-page application (SPA) built with Angular that allows users to explore the world of "Star Wars" movies and characters using the [SWAPI](https://swapi.dev/) API.

## Features
- **Home Page:** Displays a list of "Star Wars" movies.
- **Movie Details Page:** Shows movie information including title, producer, director, release date, opening crawl, and characters.
- **Character Details Page:** Displays character data and a list of movies in which the character appeared.
- **Navigation:** Users can seamlessly navigate between movies and characters.
- **Optimized API Requests:** Data is cached to minimize unnecessary API calls.
- **Loading Indicators:** Spinners are shown while data is being fetched.
- **Responsive Design:** Fully mobile-friendly UI using Angular Material.
- **Unit Tests:** Ensures application reliability.

## Tech Stack
- **Frontend:** Angular, Angular Material, SCSS, TypeScript
- **API:** SWAPI (https://swapi.dev/)
- **Testing:** Jasmine, Karma

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/OleksiiIhnatiev/StarWars.git
   cd star-wars
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   ng serve
   ```
4. Open `http://localhost:4200` in your browser.

## Live Demo
The application is hosted on GitHub Pages:
🔗 **[Star Wars Explorer - Live Demo](https://oleksiiihnatiev.github.io/start-wars-preview/)**

## Roadmap
- [x] Display movies from SWAPI
- [x] Implement movie details page
- [x] Implement character details page
- [x] Optimize API calls with caching
- [x] Add unit tests
- [x] Add pagination for character list
- [x] Improve UI/UX

## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License
Distributed under the MIT License.

## Contact
- GitHub: https://github.com/OleksiiIhnatiev/
- Email: oleksii.ihnatiev28@gmail.com

