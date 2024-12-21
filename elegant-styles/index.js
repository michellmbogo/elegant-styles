// Search and display sunglasses
function searchSunglasses() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const searchResults = document.getElementById("search-results");
  const resultsContainer = document.getElementById("results-container");


  if(!query){
    alert("Please type a name");
    return;
  }

  fetch("http://localhost:3000/glasses")
    .then((response) => response.json())
    .then((data) => {
      // Filter results based on user input
      const filteredGlasses = data.filter((glass) =>
        glass.name.toLowerCase().includes(query)
      );

      // Clear previous results
      resultsContainer.innerHTML = "";

      if (filteredGlasses.length > 0) {
        searchResults.style.display = 'block';

        filteredGlasses.forEach((product) => {
        const parentEl = document.getElementById('results-container')

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        cardDiv.addEventListener('click', ()=>{
          openDetails(product)
        })

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
        button.style.backgroundColor ='#007bff'
        button.textContent = "Add to Cart";
        button.addEventListener('click', (e) => {
          e.stopPropagation();
        
          addToCart(product.id)
        })

        const wishlistButton = document.createElement("button");
        wishlistButton.textContent = "Add to Wishlit";
        wishlistButton.addEventListener('click', (e) => {
          e.stopPropagation();

          addToWishlist(product.id)
        })

        cardFooterDiv.appendChild(button);
        cardFooterDiv.appendChild(wishlistButton);

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBodyDiv);
        cardDiv.appendChild(cardFooterDiv);


        parentEl.appendChild(cardDiv);

      })

        // Clear search results
        const clearButton = document.getElementById("clear-search");
        clearButton.style.backgroundColor="red"
        clearButton.addEventListener("click", ()=>{
          searchResults.style.display = "none";
          const searchInput = document.getElementById("search-input");
          searchInput.value = ''
          
        })
      }
       else {
        resultsContainer.innerHTML = `<p>No sunglasses found for "${query}".</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultsContainer.innerHTML = `<p>Error fetching sunglasses data.</p>`;
    });
}

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
setUpFilters()

  // Details

  // Search --
  // Add event listener for the search button
document.getElementById("search-button").addEventListener("click", searchSunglasses);
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

        // Create the parent div with class "controls"
        const controlsDiv = document.createElement("div");
        controlsDiv.classList.add("controls");

        // Create the decrease button
        const decreaseButton = document.createElement("button");
        decreaseButton.setAttribute("id", "decrease");
        decreaseButton.textContent = "-";
        decreaseButton.addEventListener('click', ()=>{
          if(product.count-1 > 0){
            updateItemsCount(product.id, product.count - 1);
          }
          else {
            console.log("Items can't be less than 1")
          }
        })

        // Create the span element for the count
        const countSpan = document.createElement("span");
        countSpan.setAttribute("id", "count");
        countSpan.textContent = product.count;

        // Create the increase button
        const increaseButton = document.createElement("button");
        increaseButton.setAttribute("id", "increase");
        increaseButton.textContent = "+";
        increaseButton.addEventListener('click', ()=>{
          updateItemsCount(product.id, product.count + 1);

        })

        // Append the decrease button, count span, and increase button to the controls div
        controlsDiv.appendChild(decreaseButton);
        controlsDiv.appendChild(countSpan);
        controlsDiv.appendChild(increaseButton);

        // Append the elements to the inner div
        innerDiv.appendChild(nameHeading);
        innerDiv.appendChild(categoryParagraph);
        innerDiv.appendChild(priceParagraph);

         const removeDiv = document.createElement("div");
         controlsDiv.classList.add("controls");
 
         // Create the decrease button
         const removeButton = document.createElement("button");
         removeButton.setAttribute("id", "remove");
         removeButton.textContent = "Remove";
         removeButton.addEventListener('click', ()=>{
          removeFromcart(product.id)
         })
        removeButton.classList.add('remove-cart')

         removeDiv.appendChild(removeButton)


        // Append the img and inner div to the parent div
        itemDiv.appendChild(img);
        itemDiv.appendChild(innerDiv);
        itemDiv.appendChild(controlsDiv)
        itemDiv.appendChild(removeDiv)

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

        const button = document.createElement("button");
        button.textContent = "Remove";
        button.classList.add('remove-button')
        button.addEventListener('click', () => {
          removeFromWishlist(product.id)
        });

        innerDiv.appendChild(nameHeading);
        innerDiv.appendChild(priceParagraph);

        itemDiv.appendChild(img);
        itemDiv.appendChild(innerDiv);
        itemDiv.appendChild(button)

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
      data.forEach((product) => {
        const parentEl = document.getElementById(`${category}`)

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        cardDiv.addEventListener('click', ()=>{
          openDetails(product)
        })

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
        button.style.backgroundColor ='#007bff'
        button.textContent = "Add to Cart";
        button.addEventListener('click', (e) => {
          e.stopPropagation();

          addToCart(product.id)
        })

        const wishlistButton = document.createElement("button");
        wishlistButton.textContent = "Add to Wishlit";
        wishlistButton.addEventListener('click', (e) => {
          e.stopPropagation();

          addToWishlist(product.id)
        })

        cardFooterDiv.appendChild(button);
        cardFooterDiv.appendChild(wishlistButton);

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

// Add item to cart
function addToCart(glassId) {
  fetch(`http://localhost:3000/glasses/${glassId}`)
    .then((response) => response.json())
    .then(async (glass) => {
      const cartItem = {
        glass_id: glass.id,
        count: 1,
        price: glass.price,
        name: glass.name,
        image: glass.image
      };

      // Prevent duplicates
      let itemExists = false;

      await fetch(`http://localhost:3000/cart`).then((response) => {
        if (response.ok) {
          return response.json()
        }
      }).then((cartItems) => {
        itemExists = cartItems.some((item) => item.glass_id === glassId)
      });

      if (itemExists) {
        alert(`${glass.name} has been already been added to your cart.`);
        return;

      }

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
          alert("Failed to add item to cart.");
        });
    })
    .catch((error) => {
      alert("Error fetching sunglasses details.");
    });
}

function removeFromcart(id) {
  // Post the item to the cart
  fetch(`http://localhost:3000/cart/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
      alert(`${glass.name} has been removed from your cart.`);
    })
    .catch((error) => {
    console.log("err", error)
      // alert("Failed to remove item from cart.");
    });
}


function updateItemsCount(glassId, newCount) {
  fetch(`http://localhost:3000/cart/${glassId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ count: newCount }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update count");
      }
      return response.json();
    })
    .then((updatedItem) => {
      console.log("Updated item:", updatedItem);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addToWishlist(glassId) {
  fetch(`http://localhost:3000/glasses/${glassId}`)
    .then((response) => response.json())
    .then(async (glass) => {
      const wishlistItem = {
        glass_id: glass.id,
        price: glass.price,
        name: glass.name,
        image: glass.image
      };

      // Prevent duplicates
      let itemExists = false;

      await fetch(`http://localhost:3000/wishlist`).then((response) => {
        if (response.ok) {
          return response.json()
        }
      }).then((wishlistItems) => {
        itemExists = wishlistItems.some((item) => item.glass_id === glassId)
      });

      if (itemExists) {
        alert(`${glass.name} has been already been added to your wishlist.`);
        return;

      }

      // Post the item to the wishlist
      fetch("http://localhost:3000/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wishlistItem),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add item to wishlist");
          }
          alert(`${glass.name} has been added to your wishlist.`);
        })
        .catch((error) => {
          alert("Failed to add item to wishlist.");
        });
    })
    .catch((error) => {
      alert("Error fetching sunglasses details.");
    });
}

function removeFromWishlist(id) {
      // Post the item to the wishlist
      fetch(`http://localhost:3000/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to remove item from wishlist");
          }
          alert(`${glass.name} has been removed from your wishlist.`);
        })
        .catch((error) => {
        console.log("err", error)
          // alert("Failed to remove item from wishlist.");
        });
}

function openDetails(product){
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");

  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalCategory = document.getElementById("modalCategory");
  const modalPrice = document.getElementById("modalPrice");
  const modalDescription = document.getElementById("modalDescription");

  // Open modal and populate data
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalCategory.textContent = `Category: ${product.category}`;
    modalPrice.textContent = `Price: Ksh ${product.price}`;
    modalDescription.textContent = product.description;

    modal.style.display = "flex";

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

function setUpFilters(){

  // References to DOM elements
  const categoryFilter = document.getElementById("categoryFilter");
  const productContainer = document.getElementById("productContainer");

  //Get all sections
  const mensSection = document.getElementById("men-section")
  const ladiesSection = document.getElementById("ladies-section")
  const kidsSection = document.getElementById("kids-section")

  
  // Function to filter products by category
  function filterProducts() {
    const selectedCategory = categoryFilter.value;
  
    if (selectedCategory === "all") {
       // Show all products
       mensSection.style.display="block";
       ladiesSection.style.display = 'block';
       kidsSection.style.display = 'block';
    } else if (selectedCategory === 'Men') {
      ladiesSection.style.display = 'none'
      kidsSection.style.display = 'none'
      mensSection.style.display="block"

    }
    else if (selectedCategory === 'Ladies') {
      mensSection.style.display = 'none'
      kidsSection.style.display = 'none'
      ladiesSection.style.display = 'block'
       
    }
    else if (selectedCategory === 'Kids') {
      mensSection.style.display = 'none'
      ladiesSection.style.display = 'none'
      kidsSection.style.display = 'block';
    }
  }
  
  // Event listener for category filter change
  categoryFilter.addEventListener("change", filterProducts);
}


