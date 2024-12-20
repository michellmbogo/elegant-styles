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
  document.getElementById("search-button").addEventListener("click", searchSunglasses);

  fetch('db.json')
    .then(response => response.json())
    .then(data => console.log(data));

  