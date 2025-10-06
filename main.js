const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const main = document.getElementById("main")
let html = ``;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  html = ``;
  const searchValue = searchInput.value;
  console.log(searchValue);
  
  let imdbId = ""
  fetch(`http://www.omdbapi.com/?apikey=25a5eeaf&s=${searchValue}&type=movie`)
    .then(response => response.json())
    .then(data => {
         console.log(data.Search);
        if(data.Search){
        data.Search.forEach(movie => {
            imdbId = movie.imdbID
            fetch(`http://www.omdbapi.com/?apikey=25a5eeaf&i=${imdbId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    getMovies(data);
                })
        });
        }
        else {
            html = `
                <div class="index-default">
                    <p class="unable-to-find-paragraph">
                        Unable to find what you’re looking for. Please try another search.
                    </p>
                </div>
            `
            main.innerHTML = html

        }
});
});
function getMovies(movie) {
    html += `
        <div class="movie-container">
          <img class="movie-img" src="${movie.Poster}"/>
          <div class="infos-wrapper">
            <div class="title-wrapper">
              <h3>${movie.Title}</h3>
              <p class="rating" id="rating-value">
                <i class="fa-solid fa-star"></i>${movie.imdbRating }
              </p>
            </div>
           <div class="details-wrapper">
              <p id="runtime">${movie.Runtime}</p>
              <p id="genre">${movie.Genre}</p>
              <button class="watchlist-btn" id="add-btn"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
           </div>
            <p class="description">
             ${movie.Plot}
            </p>
          </div>
        </div> 
        `;
        main.innerHTML = html

  }


