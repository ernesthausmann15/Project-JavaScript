let movieData = [];

async function renderMovies(SearchTerm) {
  const movieContainer = document.querySelector("#movie__list");
  movieContainer.innerHTML = ""; // Clear previous results

  movieContainer.innerHTML =
    '<div class="movies__loading"><i class="fas fa-spinner fa-spin"></i> Loading movies...</div>';

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${SearchTerm}&apikey=21079115`,
    );
    const data = await response.json();

    movieContainer.innerHTML = ""; // Clear previous results

    if (data.Response === "True") {
      const movies = data.Search;

      movieData = data.Search;
      displayMovies(movieData);
    } else {
      movieContainer.innerHTML = "<p>No movies found.</p>";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieContainer.innerHTML = "<p>Error fetching movies.</p>";
  }
}

function displayMovies(movies) {
  const movieContainer = document.querySelector("#movie__list");
  movieContainer.innerHTML = ""; // Clear previous results

  movies.forEach((movie) => {
    const movieItem = document.createElement("li");
    movieItem.classList.add("movie__result-item");
    movieItem.dataset.id = movie.imdbID; // Store the IMDb ID in a data attribute
    movieItem.innerHTML = `
          <h3 class="movie__result-title">${movie.Title}</h3>
          <div class="movie__img--wrapper">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://dummyimage.com/300x450/ccc/999&text=No+Image"}" alt="${movie.Title}"
            onerror="this.onerror=null; this.src='https://dummyimage.com/300x450/ccc/999&text=No+Image';" />
          </div>
        `;
    movieItem.addEventListener("click", () => {
      openMovieModal(movieItem.dataset.id); // Pass the IMDb ID to the modal function
    });

    movieContainer.appendChild(movieItem);
  });
}

async function openMovieModal(imdbID) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=21079115`,
    );
    const movie = await response.json();

    document.querySelector("#modal__poster").src =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://dummyimage.com/300x450/ccc/999&text=No+Image";

    document.querySelector("#modal__title").textContent = movie.Title;
    document.querySelector("#modal__year").textContent = movie.Year;
    document.querySelector("#modal__plot").textContent = movie.Plot;
    document.querySelector("#modal__actors").textContent = movie.Actors;
    document.querySelector("#modal__director").textContent = movie.Director;
    document.querySelector("#modal__genre").textContent = movie.Genre;
    document.querySelector("#modal__runtime").textContent = movie.Runtime;
    document.querySelector("#modal__released").textContent = movie.Released;
    document.querySelector("#modal__awards").textContent = movie.Awards;
    document.querySelector("#modal__imdbVotes").textContent = movie.imdbVotes;
    document.querySelector("#modal__imdbID").textContent = movie.imdbID;
    document.querySelector("#modal__type").textContent = movie.Type;
    document.querySelector("#modal__dvd").textContent = movie.DVD;
    document.querySelector("#modal__boxOffice").textContent = movie.BoxOffice;
    document.querySelector("#modal__production").textContent = movie.Production;
    document.querySelector("#modal__website").textContent = movie.Website;

    document.querySelector("#movie__modal").classList.add("active");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

function filterMovies(event) {
  const filterValue = event.target.value;

  let sortedMovies = [...movieData]; // Create a copy of the movieData array

  if (filterValue === "NEWEST") {
    movieData.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (filterValue === "OLDEST") {
    movieData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  displayMovies(movieData);
}

const modal = document.querySelector("#movie__modal");
const closeModalButton = document.querySelector(".modal__close");

closeModalButton.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

renderMovies("Avengers"); // Initial render with a default search term

const searchForm = document.querySelector("#search__form");
const searchInput = document.querySelector("#search__input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    renderMovies(searchTerm);
  }
});
