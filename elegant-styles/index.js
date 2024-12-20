// Search and display sunglasses
function searchSunglasses() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const resultsContainer = document.getElementById("results-container");

  fetch("http://localhost:3000/glasses")
    .then((response) => response.json())
    .then((data) => {
      // Filter results based on user input
      const filteredGlasses = data.filter((glass) =>
        glass.category.toLowerCase().includes(query)
      );

      // Clear previous results
      resultsContainer.innerHTML = "";

      if (filteredGlasses.length > 0) {
        filteredGlasses.forEach((glass) => {
          const glassDiv = document.createElement("div");
          glassDiv.style.border = "1px solid #ccc";
          glassDiv.style.padding = "10px";
          glassDiv.style.margin = "10px";
          glassDiv.innerHTML = `
              <img src="${glass.image}" alt="${glass.name}" style="width: 150px; height: 150px;">
              <h3>${glass.name}</h3>
              <p>Category: ${glass.category}</p>
              <p>Price: ${glass.price}</p>
              <p>${glass.description}</p>
              <button onclick="addToCart(${glass.id})">Add to Cart</button>
            `;
          resultsContainer.appendChild(glassDiv);
        });
      } else {
        resultsContainer.innerHTML = `<p>No sunglasses found for "${query}".</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultsContainer.innerHTML = `<p>Error fetching sunglasses data.</p>`;
    });
}

// Add item to cart
function addToCart(glassId) {
  fetch(`http://localhost:3000/glasses/${glassId}`)
    .then((response) => response.json())
    .then((glass) => {
      const cartItem = {
        glass_id: glass.id,
        count: 1,
        total_price: parseFloat(glass.price.replace(" KES", "")) || glass.price,
      };

      // Post the item to the cart
      fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add item to cart");
          }
          alert(`${glass.name} has been added to your cart.`);
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          alert("Failed to add item to cart.");
        });
    })
    .catch((error) => {
      console.error("Error fetching glass data:", error);
      alert("Error fetching sunglasses details.");
    });
}

// Add event listener for the search button
// document.getElementById("search-button").addEventListener("click", searchSunglasses);

fetch('db.json')
  .then(response => response.json())
  .then(data => console.log(data));

document.addEventListener('DOMContentLoaded', () => {
  // Fetch and load cart
  fetchCart();

  // Fetch and load wishlit
  fetchWishlist();

  // Fetch and load categories(men, women, kids)
  fetchCategory('Men');

  fetchCategory('Ladies');

  fetchCategory('Kids')

  // Add filters - filter by category

  // Details

  // Search --
});

async function fetchCart() {
  const url = 'http://localhost:3000/cart';

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      data.forEach((product) => {
        const parentEl = document.getElementById('cart')

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const img = document.createElement("img");
        img.setAttribute("src", product.image);
        img.setAttribute("alt", product.name);

        const innerDiv = document.createElement("div");

        const nameHeading = document.createElement("h4");
        nameHeading.textContent = `Name: ${product.name}`;

        const categoryParagraph = document.createElement("p");
        categoryParagraph.textContent = `Count: ${product.count}`;

        const priceParagraph = document.createElement("p");
        priceParagraph.textContent = `Price: ${product.count} x ${product.price} = KES ${product.count * product.price}`;


        // Append the elements to the inner div
        innerDiv.appendChild(nameHeading);
        innerDiv.appendChild(categoryParagraph);
        innerDiv.appendChild(priceParagraph);

        // Append the img and inner div to the parent div
        itemDiv.appendChild(img);
        itemDiv.appendChild(innerDiv);

        // Append the item div to the body or any desired container
        parentEl.appendChild(itemDiv);

      })
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function fetchWishlist() {
  const url = 'http://localhost:3000/wishlist';

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      data.forEach((product) => {
        const parentEl = document.getElementById('wishlist');

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const img = document.createElement("img");
        img.setAttribute("src", product.image);
        img.setAttribute("alt", product.name);

        const innerDiv = document.createElement("div");

        const nameHeading = document.createElement("h4");
        nameHeading.textContent = `Name: ${product.name}`;

        const priceParagraph = document.createElement("p");
        priceParagraph.textContent = `Price: KES ${product.price}`;

        innerDiv.appendChild(nameHeading);
        innerDiv.appendChild(priceParagraph);

        itemDiv.appendChild(img);
        itemDiv.appendChild(innerDiv);

        parentEl.appendChild(itemDiv);

      })
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function fetchCategory(category) {
  const url = `http://localhost:3000/glasses?category=${category}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("data---->", data);
      data.forEach((product) => {
        const parentEl = document.getElementById(`${category}`)

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        const img = document.createElement("img");
        img.setAttribute("src", product.image);
        img.setAttribute("alt", product.name);
        img.classList.add("sunglass_image");

        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");

        const nameHeading = document.createElement("h3");
        nameHeading.textContent = product.name;

        const categoryParagraph = document.createElement("p");
        categoryParagraph.classList.add("category");
        categoryParagraph.textContent = `Category: ${product.category}`;

        const descriptionParagraph = document.createElement("p");
        descriptionParagraph.classList.add("description");
        descriptionParagraph.textContent = product.description;

        const priceParagraph = document.createElement("p");
        priceParagraph.classList.add("price");
        priceParagraph.textContent = `Price: Ksh ${product.price}`;

        cardBodyDiv.appendChild(nameHeading);
        cardBodyDiv.appendChild(categoryParagraph);
        cardBodyDiv.appendChild(descriptionParagraph);
        cardBodyDiv.appendChild(priceParagraph);

        const cardFooterDiv = document.createElement("div");
        cardFooterDiv.classList.add("card-footer");

        const button = document.createElement("button");
        button.textContent = "Add to Cart";

        cardFooterDiv.appendChild(button);

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBodyDiv);
        cardDiv.appendChild(cardFooterDiv);

        document.body.appendChild(cardDiv);


        parentEl.appendChild(cardDiv);

      })
    })
    .catch(error => {
      console.error('Error:', error);
    });

}


