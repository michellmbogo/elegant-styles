document.addEventListener("DOMContentLoaded", function () {
    getFirstMovie().then(() => getAllMovies())
})

// 1. Get 1st move getFirstMovie
async function getFirstMovie() {
    const url = 'http://localhost:3000/films/1';

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('first_movie_image').src = data.poster;
            document.getElementById('first_movie_title').textContent = data.title;
            document.getElementById('first_runtime').textContent = `Runtime: ${data.runtime}`;
            document.getElementById('first_showtime').textContent = `Showtime: ${data.showtime}`;
            document.getElementById('first_available_tickets').textContent = `Available tickets:${data.capacity - data.tickets_sold}`;

            const spinner = document.getElementById('spinner-container')
            spinner.style.display = "none";

            const mainSection = document.getElementById("main_section");
            mainSection.style.visibility = "visible";

            const buyButton1 = document.getElementById("buy_button1");
            let availableTickets = data.capacity - data.tickets_sold;

            buyButton1.addEventListener("click", () => {
                if (availableTickets > 0) {
                    availableTickets--;
                    document.getElementById('first_available_tickets').textContent = `Available tickets:${availableTickets}`;
                    if (availableTickets === 0) {
                        buyButton1.disabled = true;
                        buyButton1.textContent = "Sold Out";
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 2. Gets all the movies getAllMovies
async function getAllMovies() {
    const url = "http://localhost:3000/films";

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(movies => {
            const parentSection = document.getElementById("all_movies_list");

            function createMovieSection(data, idSuffix) {
                const availableTickets = data.capacity - data.tickets_sold;

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
                movieSection.appendChild(image);

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
                    if (_availableTickets > 0) {
                        _availableTickets--;
                        tickets.textContent = `Available tickets:${_availableTickets}`;
                        if (_availableTickets === 0) {
                            button.disabled = true;
                            button.textContent = "Sold Out";
                        }
                    }
                });

                rightCol.style.float = 'right';

                movieSection.appendChild(rightCol);
                parentSection.appendChild(movieSection);
            }

            movies.forEach((movie, index) => {
                createMovieSection(movie, index + 1);
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
