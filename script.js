const apiKey = '0e9844cf61d5a2ec276f72cd269f738b';  
const apiUrl = 'https://api.themoviedb.org/3';


// event listeners

document.getElementById('loadPopular').addEventListener('click', function() { 
    fetchMoviesAndTvshows('popular');
});

document.getElementById('loadTopRated').addEventListener('click', function() { 
    fetchMoviesAndTvshows('top_rated');
});

document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    const type = document.getElementById('typeSelection').value;
    search(query, type);
});

//fetches movies and tvshows for top10s - if result function displayMoviesAndTvshows if no result function displaynoresults

function fetchMoviesAndTvshows(type) {
    const url = `${apiUrl}/movie/${type}?api_key=${apiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response error');
            return response.json();
        })
        .then(data => {
            // slices the results to only take the top 10
            const topTenResults = data.results.slice(0, 10);
            if (topTenResults.length === 0) {
                displayNoResults();
            } else {
                displayMoviesAndTvshows(topTenResults);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError();
        });
}

//displays movies and tvshows - clears existing content and loops over array appending the results in list items

function displayMoviesAndTvshows(movies) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';

    movies.forEach(movie => { //loops over and creates new li items for each movie/tvshow
        const li = document.createElement('li');
        li.className = 'movie';

        const img = document.createElement('img'); 
        img.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/150x225/eeeeee/cccccc?text=No+Image&font=roboto';

        const title = document.createElement('h2');
        title.textContent = movie.title;

        const releaseDate = document.createElement('p');
        releaseDate.textContent = `Release date: ${movie.release_date}`;

        const description = document.createElement('p');
        description.textContent = movie.overview;

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(releaseDate);
        li.appendChild(description);

        moviesList.appendChild(li);
    });
}


// search function based on input query and type (movie/show or person) and makes the request url - depending on if search was for a person or  a movie/tvshow it calls the function needed


function search(query, type) {
    const url = `${apiUrl}/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response error');
            return response.json();
        })
        .then(data => {
            if (data.results.length === 0) {
                displayNoResults();
            } else if (type === 'movie') {
                displayMoviesAndTvshows(data.results);
            } else {
                displayPeople(data.results);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayError();
        });
}

// function similar to displaymoviesandtvshows but for people

function displayPeople(people) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';

    people.forEach(person => { // loops thorugh each object in the array and creates li to hold the persons info
        const li = document.createElement('li');
        li.className = 'person';

        const img = document.createElement('img'); //creates url if profile path exists otherwise placeholder  
        img.src = person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://placehold.co/120x180/eeeeee/cccccc?text=No+Image&font=roboto';
        

        const name = document.createElement('h2');
        name.textContent = person.name;

        const category = document.createElement('p');
        category.textContent = `Known for: ${person.known_for_department}`;

        const knownFor = document.createElement('ul'); // creates li and img for each work they're famous for and appends it  
        person.known_for.forEach(item => {
            const itemLi = document.createElement('li');
            const itemImg = document.createElement('img');
            itemImg.src = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/90x135/eeeeee/cccccc?text=No+Image&font=roboto';
        
            itemLi.appendChild(itemImg);
            itemLi.append(`${item.title || item.name} (${item.media_type === 'movie' ? 'Movie' : 'TV Show'})`);

            knownFor.appendChild(itemLi);
        });

        // appends the info into main li item

        li.appendChild(img);
        li.appendChild(name);
        li.appendChild(category);
        li.appendChild(knownFor);

        moviesList.appendChild(li);
    });
}

// clears movielist and replaces it with the appropriate message

function displayNoResults() {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = `<li class='noResults'>No results found</li>`;
}

function displayError() {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = `<li class='error'>An error occurred</li>`;
}

