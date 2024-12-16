document.addEventListener("DOMContentLoaded", function () {
    getFirstMovie().then(() => getAllMovies())
})

// 1. Get 1st move getFirstMovie
async function getFirstMovie() {
    // Call the endpoint to get the first movie
    // http://localhost:3000/films/1
    const url = 'http://localhost:3000/films/1';

    // Make a GET request
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            // update first movie section
            document.getElementById('first_movie_image').src = data.poster;
            document.getElementById('first_movie_title').textContent = data.title;
            document.getElementById('first_runtime').textContent = `Runtime: ${data.runtime}`;
            document.getElementById('first_showtime').textContent = `Showtime: ${data.showtime}`;
            document.getElementById('first_available_tickets').textContent = `Available tickets:${data.capacity - data.tickets_sold}`;

            //Hide the spinner
            const spinner = document.getElementById('spinner-container')
            spinner.style.display = "none"

            //Show the content
            const mainSection = document.getElementById("main_section");
            mainSection.style.visibility = "visible"

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// 2. Gets all the movies getAllMovies
async function getAllMovies() {
    // Call the endpoint to get all the movies
    // http://localhost:3000/films
    const url = "http://localhost:3000/films";

    // Make a GET request
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse JSON response
        })
        .then(movies => {
            // Update UI with data
            // Grab the all movies section all_movies_list 
            //For each movie item Append movie item to all movies 

            // Reference to the parent section
            const parentSection = document.getElementById("all_movies_list");


            function createMovieSection(data, idSuffix) {
                const availableTickets = data.capacity - data.tickets_sold;

                // Create a new section element
                const movieSection = document.createElement("section");
                movieSection.id = `movie_section_${idSuffix}`;

                const title = document.createElement("h3");
                title.id = `movie_title_${idSuffix}`;
                title.textContent = data.title;
                movieSection.appendChild(title);

                const image = document.createElement('img');
                image.id = 'poster_img';
                image.src = data.poster;
                image.alt = 'Poster Image';
                movieSection.appendChild(image)

                const rightCol = document.createElement("section");


                const runtime = document.createElement("p");
                runtime.id = `movie_runtime_${idSuffix}`;
                runtime.textContent = `Runtime: ${data.runtime}`;
                rightCol.appendChild(runtime);

                const showtime = document.createElement("p");
                showtime.id = `movie_showtime_${idSuffix}`;
                showtime.textContent = `Showtime: ${data.showtime}`;
                rightCol.appendChild(showtime);

                const tickets = document.createElement("p");
                tickets.id = `movie_tickets_${idSuffix}`;
                tickets.textContent = `Available tickets:${availableTickets}`;
                rightCol.appendChild(tickets);

                const button = document.createElement("button");
                button.id = `buy_button_${idSuffix}`;
                button.type = "submit";
                button.textContent = "Buy Ticket";
                rightCol.appendChild(button);

                let _availableTickets = availableTickets;

                button.addEventListener('click', () => {
                    // Get available value and decrement by 1
                    document.getElementById(`movie_tickets_${idSuffix}`).textContent = `Available tickets:${_availableTickets - 1 < 0 ? 0 : _availableTickets - 1}`;

                    _availableTickets = _availableTickets - 1 < 0 ? 0 : _availableTickets - 1;
                });

                rightCol.style.float = 'right'

                movieSection.appendChild(rightCol);
                parentSection.appendChild(movieSection);
            }

            // Loop through the JSON array and create sections
            movies.forEach((movie, index) => {
                createMovieSection(movie, index + 1); // Use the index for unique IDs
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });

}

// Attach click listener to buy_button1
const buyButton1 = document.getElementById("buy_button1");
buyButton1.addEventListener("click", () => {
    // Get first_available_tickets value and decrement by 1
    const availableTickets = document.getElementById("first_available_tickets").textContent;

    const tickets = parseInt(availableTickets.split(":")[1])

    document.getElementById('first_available_tickets').textContent = `Available tickets:${tickets - 1 < 0 ? 0 : tickets - 1}`;
})