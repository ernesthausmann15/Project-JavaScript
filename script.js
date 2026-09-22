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
    setModalField("modal__year", "Year", movie.Year);
    setModalField("modal__released", "Released", movie.Released);
    setModalField("modal__runtime", "Runtime", movie.Runtime);
    setModalField("modal__genre", "Genre", movie.Genre);
    setModalField("modal__director", "Director", movie.Director);
    setModalField("modal__writer", "Writer", movie.Writer);
    setModalField("modal__actors", "Actors", movie.Actors);
    setModalField("modal__plot", "Plot", movie.Plot);
    setModalField("modal__language", "Language", movie.Language);
    setModalField("modal__country", "Country", movie.Country);
    setModalField("modal__awards", "Awards", movie.Awards);
    setModalField("modal__ratings", "Ratings", movie.Ratings);
    setModalField("modal__metascore", "Metascore", movie.Metascore);
    setModalField("modal__imdbRating", "IMDb Rating", movie.imdbRating);
    setModalField("modal__imdbVotes", "IMDb Votes", movie.imdbVotes);
    setModalField("modal__imdbID", "IMDb ID", movie.imdbID);
    setModalField("modal__type", "Type", movie.Type);
    setModalField("modal__dvd", "DVD", movie.DVD);
    setModalField("modal__boxOffice", "Box Office", movie.BoxOffice);
    setModalField("modal__production", "Production", movie.Production);
    setModalField("modal__website", "Website", movie.Website);

    document.querySelector("#movie__modal").classList.add("active");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

function setModalField(elementId, label, value) {
  const element = document.querySelector(`#${elementId}`);
  const labelElement = document.createElement("strong");

  labelElement.className = "modal__field-label";
  labelElement.textContent = `${label}:`;
  element.replaceChildren(
    labelElement,
    document.createTextNode(` ${value || "N/A"}`),
  );
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

const searchForm = document.querySelector("#search__form");
const searchInput = document.querySelector("#search__input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    renderMovies(searchTerm);
  }
});
