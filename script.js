let movieData = [];
const MOVIE_LOADING_DELAY = 2000;

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const themeToggle = document.querySelector("#theme-toggle");

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
  themeToggle.querySelector(".theme-toggle__text").textContent = isDark
    ? "Light mode"
    : "Dark mode";
  themeToggle.querySelector("span").textContent = isDark ? "☀" : "☾";
}

setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
themeToggle.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark-mode"));
});

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty(
    "--pointer-x",
    `${event.clientX}px`,
  );
  document.documentElement.style.setProperty(
    "--pointer-y",
    `${event.clientY}px`,
  );
});

async function renderMovies(SearchTerm) {
  const movieContainer = document.querySelector("#movie__list");
  movieContainer.innerHTML = ""; // Clear previous results

  movieContainer.innerHTML =
    '<div class="movies__loading" role="status"><span class="loading-spinner" aria-hidden="true"></span><span>Loading movies...</span></div>';

  const loadingDelay = wait(MOVIE_LOADING_DELAY);

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${SearchTerm}&apikey=21079115`,
    );
    const data = await response.json();
    await loadingDelay;

    movieContainer.innerHTML = ""; // Clear previous results

    if (data.Response === "True") {
      const movies = data.Search;

      movieData = data.Search;
      displayMovies(movieData);
    } else {
      movieContainer.innerHTML = "<p>No movies found.</p>";
    }
  } catch (error) {
    await loadingDelay;
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

  const sortedMovies = [...movieData];

  if (filterValue === "NEWEST") {
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (filterValue === "OLDEST") {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (filterValue === "A_TO_Z") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filterValue === "Z_TO_A") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  }

  displayMovies(sortedMovies);
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
