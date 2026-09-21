async function renderMovies(SearchTerm) {
    const response = await fetch(`https://www.omdbapi.com/?s=${SearchTerm}&apikey=21079115`);
    const data = await response.json();
    const movies = data.Search; 
    
    const movieContainer = document.querySelector('.movie__results-container');
    movieContainer.innerHTML = ''; // Clear previous results

    if (movies === "True") {
      movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('row', 'movie__result');
        movieElement.innerHTML = `
          <div class="movie__result-image">
            <img src="${movie.Poster}" alt="${movie.Title}" />
          </div>
          <div class="movie__result-details">
            <h3 class="movie__result-title">${movie.Title}</h3>
            <p class="movie__result-description">${movie.Plot}</p>
          </div>
        `;
        movieContainer.appendChild(movieElement);
      });
    } else {
      movieContainer.innerHTML = '<p>No movies found.</p>';
    }
}