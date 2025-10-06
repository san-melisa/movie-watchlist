const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const main = document.getElementById("main");
const addBtn = document.getElementById("add-btn");
const watchlistMain = document.getElementById("watchlist-main");

let html = ``;
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

console.log(watchlist);

if (searchForm) {
  document.addEventListener("DOMContentLoaded", () => {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      html = ``;
      const searchValue = searchInput.value;
      //   console.log(searchValue);

      let imdbId = "";
      fetch(
        `http://www.omdbapi.com/?apikey=25a5eeaf&s=${searchValue}&type=movie`
      )
        .then((response) => response.json())
        .then((data) => {
          //  console.log(data.Search);
          if (data.Search) {
            data.Search.forEach((movie) => {
              imdbId = movie.imdbID;
              fetch(`http://www.omdbapi.com/?apikey=25a5eeaf&i=${imdbId}`)
                .then((response) => response.json())
                .then((data) => {
                  // console.log(data);
                  data = checkData(data)
                  getMovies(data);
                });
            });
          } else {
            html = `
                <div class="index-default">
                    <p class="unable-to-find-paragraph">
                        Unable to find what you’re looking for. Please try another search.
                    </p>
                </div>
            `;
            main.innerHTML = html;
          }
        });
    });
  });
}

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("#add-btn");
  const removeBtn = e.target.closest("#remove-btn");

//   if (e.target.id === "add-btn") {
//     addToWatchlist(e.target.dataset.added);
//   }
//   else if (e.target.id === "remove-btn") {
//     removeFromWatchlist(e.target.dataset.removed);
//   }

 if (addBtn) {
    addToWatchlist(addBtn.dataset.added);
  }

  else if (removeBtn) {
    removeFromWatchlist(removeBtn.dataset.removed);
  }
});

function addToWatchlist(imdbId) {
  if (!imdbId) return;

  fetch(`http://www.omdbapi.com/?apikey=25a5eeaf&i=${imdbId}`)
    .then((response) => response.json())
    .then((data) => {
      checkData(data)
      console.log(data);
      watchlist.push(data);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      renderWatchlist(watchlist);
    });
}

function removeFromWatchlist(imdbId) {
  if (!imdbId) return;
  watchlist = watchlist.filter((movie) => movie.imdbID !== imdbId);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist(watchlist);
}

function getMovies(movie) {

  html += `
        <div class="movie-container">
          <img class="movie-img" src="${movie.Poster}"/>
          <div class="infos-wrapper">
            <div class="title-wrapper">
              <h3>${movie.Title}</h3>
              <p class="rating" id="rating-value">
                <i class="fa-solid fa-star"></i>${movie.imdbRating}
              </p>
            </div>
           <div class="details-wrapper">
              <p id="runtime">${movie.Runtime}</p>
              <p id="genre" class="genre-text">${movie.Genre}</p>
              <button class="watchlist-btn" id="add-btn" data-added="${movie.imdbID}"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
           </div>
            <p class="description">
             ${movie.Plot}
            </p>
          </div>
        </div> 
        `;
  main.innerHTML = html;
}

function renderWatchlist(watchlist) {
  let watchlistHtml = ``;
  for (const movie of watchlist) {

    watchlistHtml += `
        <div class="movie-container">
          <img class="movie-img" src="${movie.Poster}"/>
          <div class="infos-wrapper">
            <div class="title-wrapper">
              <h3>${movie.Title}</h3>
              <p class="rating" id="rating-value">
                <i class="fa-solid fa-star"></i>${movie.imdbRating}
              </p>
            </div>
           <div class="details-wrapper">
              <p id="runtime">${movie.Runtime}</p>
              <p id="genre" class="genre-text">${movie.Genre}</p>
              <button class="watchlist-btn" id="remove-btn" data-removed="${movie.imdbID}"><i class="fa-solid fa-circle-minus"></i> Watchlist</button>
           </div>
            <p class="description">
             ${movie.Plot}
            </p>
          </div>
        </div> 
        `;
  }
  watchlistMain.innerHTML = watchlistHtml;
}

if (watchlistMain) {
  if (watchlist.length > 0) {
    renderWatchlist(watchlist);
  }
}

function checkData(data){
    
    data.Poster = data.Poster !== "N/A" ? data.Poster : "images/no-image-found.png";
    data.imdbRating = data.imdbRating !== "N/A" ? data.imdbRating : "No rating";
    data.Title = data.Title !== "N/A" ? data.Title : "No title";
    data.Runtime = data.Runtime !== "N/A" ? data.Runtime : "No runtime";
    data.Genre = data.Genre !== "N/A" ? data.Genre : "No genre";
    data.Plot = data.Plot !== "N/A" ? data.Plot : "No description";


    return data;
    
}