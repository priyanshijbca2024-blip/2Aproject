// Wait until the complete HTML page is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Unique key used to store cart data in browser localStorage
  const CART_KEY = "coachingCart";

  // ==================================================
  // SECTION 1: SHOPPING CART HELPER FUNCTIONS
  // ==================================================

  // Get cart products from localStorage
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  // Save updated cart data in localStorage
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Open shopping cart sidebar
  function openCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");

    if (sidebar && overlay) {
      sidebar.classList.add("active");
      overlay.classList.add("active");
      document.body.classList.add("cart-open");
    }
  }

  // Close shopping cart sidebar
  function closeCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");

    if (sidebar && overlay) {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("cart-open");
    }
  }

  // Get cart-related HTML elements
  const openCartButton = document.getElementById("openCart");
  const closeCartButton = document.getElementById("closeCart");
  const overlay = document.getElementById("cartOverlay");
  const cartItemsElement = document.getElementById("cartItems");

  // Add click events to open and close cart sidebar
  if (openCartButton) openCartButton.addEventListener("click", openCart);

  if (closeCartButton) closeCartButton.addEventListener("click", closeCart);

  if (overlay) overlay.addEventListener("click", closeCart);

  // Close cart sidebar when Escape key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeCart();
  });

  // Display cart products and calculate total amount
  function renderCart() {
    const cart = getCart();

    // Get HTML elements where cart information will be displayed
    const itemsElement = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("cartSubtotal");
    const headerTotalElement = document.getElementById("headerTotal");
    const countElement = document.getElementById("cartCount");

    // Variables for calculating cart subtotal and quantity
    let subtotal = 0;
    let totalQuantity = 0;

    // Calculate total price and total product quantity
    cart.forEach(function (item) {
      subtotal += Number(item.price) * Number(item.quantity);
      totalQuantity += Number(item.quantity);
    });

    // Display cart products in sidebar
    if (itemsElement) {
      // Show message if cart is empty
      if (cart.length === 0) {
        itemsElement.innerHTML =
          '<p class="empty-cart">No products in the cart.</p>';
      } else {
        // Generate HTML for every product in the cart
        itemsElement.innerHTML = cart
          .map(function (item) {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            const image = item.image || "";

            return `
            <div class="cart-item">

              <img class="cart-item-image" src="${image}" alt="">

              <div class="cart-item-info">

                <h3>${escapeHTML(item.title)}</h3>

                <p>${quantity} × £${price.toFixed(2)}</p>

                <strong>£${(price * quantity).toFixed(2)}</strong>

              </div>

              <!-- Button to remove product from cart -->
              <button class="remove-cart-item" type="button"
                data-id="${escapeHTML(String(item.id))}"
                aria-label="Remove ${escapeHTML(item.title)}">
                ×
              </button>

            </div>`;
          })
          .join("");
      }
    }

    // Update subtotal in cart sidebar
    if (subtotalElement)
      subtotalElement.textContent = "£" + subtotal.toFixed(2);

    // Update total amount in website header
    if (headerTotalElement)
      headerTotalElement.textContent = "£" + subtotal.toFixed(2);

    // Update total number of products in cart icon
    if (countElement) countElement.textContent = String(totalQuantity);
  }

  // Convert special HTML characters into safe text
  // This helps prevent HTML injection through product data
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[char];
    });
  }

  // Remove product from cart sidebar when remove button is clicked
  if (cartItemsElement) {
    cartItemsElement.addEventListener("click", function (event) {
      const removeButton = event.target.closest(".remove-cart-item");

      if (!removeButton) return;

      // Get product ID from clicked remove button
      const id = removeButton.dataset.id;

      // Create updated cart without selected product
      const updatedCart = getCart().filter(function (item) {
        return String(item.id) !== String(id);
      });

      // Save updated cart and refresh sidebar
      saveCart(updatedCart);
      renderCart();
    });
  }

  // Display saved cart whenever a page is loaded
  renderCart();

  // ==================================================
  // SECTION 2: FULL CART PAGE FUNCTIONS
  // ==================================================

  // Display all cart products in cart.html
  function renderCartPage() {
    const rows = document.getElementById("cartPageItems");

    // Stop if cart page table is not available
    if (!rows) return;

    const cart = getCart();

    // Check whether cart is empty
    if (!cart.length) {
      rows.innerHTML = `
        <tr>
          <td colspan="6" class="cart-empty-cell">
            Your cart is currently empty.
            <a href="Work_with_me.html">Return to shop</a>
          </td>
        </tr>`;
    } else {
      // Generate table rows for all cart products
      rows.innerHTML = cart
        .map(function (item) {
          const price = Number(item.price) || 0;

          return `
          <tr>

            <!-- Remove Product Button -->
            <td>
              <button class="remove-cart-item cart-page-remove"
                type="button"
                data-id="${escapeHTML(String(item.id))}"
                aria-label="Remove ${escapeHTML(item.title)}">
                ×
              </button>
            </td>

            <!-- Product Image -->
            <td class="cart-product-image-cell">
              <img class="cart-page-image"
                src="${escapeHTML(item.image || "")}"
                alt="${escapeHTML(item.title)}">
            </td>

            <!-- Product Name and Link -->
            <td>
              <a class="cart-product-name"
                href="product.html?id=${encodeURIComponent(item.id)}">
                ${escapeHTML(item.title)}
              </a>
            </td>

            <!-- Product Price -->
            <td>£${price.toFixed(2)}</td>

            <!-- Product Quantity Input -->
            <td>
              <input class="cart-page-quantity"
                type="number"
                min="1"
                step="1"
                value="${Math.max(1, Number(item.quantity) || 1)}"
                data-id="${escapeHTML(String(item.id))}"
                aria-label="Quantity for ${escapeHTML(item.title)}">
            </td>

            <!-- Product Subtotal -->
            <td>
              £${(price * Number(item.quantity)).toFixed(2)}
            </td>

          </tr>`;
        })
        .join("");
    }

    // Calculate total cart amount
    const subtotal = cart.reduce(function (sum, item) {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    // Format subtotal with currency symbol
    const formatted = "£" + subtotal.toFixed(2);

    // Get subtotal and total HTML elements
    const subtotalEl = document.getElementById("cartPageSubtotal");
    const totalEl = document.getElementById("cartPageTotal");

    // Display calculated amounts
    if (subtotalEl) subtotalEl.textContent = formatted;

    if (totalEl) totalEl.textContent = formatted;
  }

  // Display cart products when cart page loads
  renderCartPage();

  // Remove products directly from full cart page
  const cartPageItems = document.getElementById("cartPageItems");

  if (cartPageItems) {
    cartPageItems.addEventListener("click", function (event) {
      const removeButton = event.target.closest(".cart-page-remove");

      if (!removeButton) return;

      // Remove selected product using its ID
      saveCart(
        getCart().filter(function (item) {
          return String(item.id) !== String(removeButton.dataset.id);
        }),
      );

      // Refresh sidebar and full cart page
      renderCart();
      renderCartPage();
    });
  }

  // Update product quantities in cart
  const updateCartButton = document.getElementById("updateCart");

  if (updateCartButton)
    updateCartButton.addEventListener("click", function () {
      // Get all quantity input fields
      const quantities = document.querySelectorAll(".cart-page-quantity");

      const cart = getCart();

      // Update quantity of each product
      quantities.forEach(function (input) {
        const quantity = Number(input.value);

        // Find matching product using its ID
        const item = cart.find(function (entry) {
          return String(entry.id) === String(input.dataset.id);
        });

        // Accept only positive whole numbers
        if (item && Number.isInteger(quantity) && quantity > 0) {
          item.quantity = quantity;
        }
      });

      // Save updated quantities
      saveCart(cart);

      // Refresh cart information
      renderCart();
      renderCartPage();
    });

  // ==================================================
  // SECTION 3: COUPON CODE FUNCTIONALITY
  // ==================================================

  // Display invalid coupon message
  function showInvalidCoupon(messageId) {
    const message = document.getElementById(messageId);

    if (message) message.textContent = "Coupon code is not valid.";
  }

  // Apply coupon on full cart page
  const applyCartCoupon = document.getElementById("applyCartCoupon");

  if (applyCartCoupon)
    applyCartCoupon.addEventListener("click", function () {
      showInvalidCoupon("cartCouponMessage");
    });

  // ==================================================
  // SECTION 4: CHECKOUT PAGE FUNCTIONS
  // ==================================================

  // Display cart products in checkout order summary
  function renderCheckoutSummary() {
    const itemsElement = document.getElementById("checkoutOrderItems");

    // Stop if checkout page is not available
    if (!itemsElement) return;

    const cart = getCart();

    // Display products and their individual subtotals
    itemsElement.innerHTML = cart.length
      ? cart
          .map(function (item) {
            const subtotal = Number(item.price) * Number(item.quantity);

            return `
            <div class="order-product-line">

              <span>
                ${escapeHTML(item.title)}

                <span class="order-quantity">
                  × ${Number(item.quantity)}
                </span>

              </span>

              <strong>£${subtotal.toFixed(2)}</strong>

            </div>`;
          })
          .join("")
      : `
        <p class="checkout-empty">
          Your cart is empty.
          <a href="Work_with_me.html">Browse packages</a>.
        </p>`;

    // Calculate final checkout amount
    const total = cart.reduce(function (sum, item) {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    // Update subtotal and total on checkout page
    ["checkoutSubtotal", "checkoutTotal"].forEach(function (id) {
      const element = document.getElementById(id);

      if (element) element.textContent = "£" + total.toFixed(2);
    });
  }

  // Display checkout order summary when page loads
  renderCheckoutSummary();

  // Show or hide checkout coupon input field
  const toggleCheckoutCoupon = document.getElementById("toggleCheckoutCoupon");

  if (toggleCheckoutCoupon)
    toggleCheckoutCoupon.addEventListener("click", function () {
      const couponForm = document.getElementById("checkoutCouponForm");

      if (couponForm) couponForm.classList.toggle("d-none");
    });

  // Apply coupon on checkout page
  const applyCheckoutCoupon = document.getElementById("applyCheckoutCoupon");

  if (applyCheckoutCoupon)
    applyCheckoutCoupon.addEventListener("click", function () {
      showInvalidCoupon("checkoutCouponMessage");
    });

  // Handle checkout form submission
  const checkoutForm = document.getElementById("checkoutForm");

  if (checkoutForm)
    checkoutForm.addEventListener("submit", function (event) {
      // Prevent default form submission
      event.preventDefault();

      // Get checkout error message element
      const error = document.getElementById("checkoutError");

      // Display payment method error
      if (error) {
        error.classList.remove("d-none");

        // Scroll to error message
        error.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });

  // ==================================================
  // SECTION 5: LOAD PRODUCTS FROM JSON FILE
  // ==================================================

  // Fetch product data from packages.json
  fetch("packages.json")
    .then(function (response) {
      // Check whether JSON file loaded successfully
      if (!response.ok) throw new Error("Could not load packages.json");

      // Convert response into JavaScript data
      return response.json();
    })

    // Work with product data after loading JSON
    .then(function (products) {
      // ----------------------------------------------
      // PART 1: PRODUCT LISTING PAGE
      // ----------------------------------------------

      const productList = document.getElementById("productList");

      if (productList) {
        // Generate product cards dynamically
        productList.innerHTML = products
          .map(function (product) {
            return `
            <div class="col-lg-3 col-md-6">

              <!-- Product Card Link -->
              <a href="product.html?id=${encodeURIComponent(product.id)}"
                class="product-card">

                <!-- Product Image -->
                <img src="${product.image}"
                  alt="${escapeHTML(product.title)}">

                <div class="product-card-content">

                  <!-- Product Name -->
                  <h6>${escapeHTML(product.title)}</h6>

                  <!-- Product Price -->
                  <span class="card-price">
                    £${Number(product.price).toFixed(2)}
                  </span>

                  <!-- Product Description -->
                  <p>${escapeHTML(product.description)}</p>

                  <!-- Product Duration -->
                  <small>
                    Duration : ${escapeHTML(product.duration)}
                  </small>

                </div>

              </a>

            </div>`;
          })
          .join("");
      }

      // ----------------------------------------------
      // PART 2: PRODUCT DETAILS PAGE
      // ----------------------------------------------

      const productImage = document.getElementById("productImage");

      // Stop if current page is not product details page
      if (!productImage) return;

      // Get product ID from URL
      const params = new URLSearchParams(window.location.search);

      const productId = params.get("id");

      // Find selected product using its ID
      const selectedProduct = products.find(function (product) {
        return String(product.id) === String(productId);
      });

      // Display error if selected product does not exist
      if (!selectedProduct) {
        const pageContent = document.getElementById("pageContent");

        if (pageContent) {
          pageContent.innerHTML = `
            <div class="empty-state">

              <h1>Product not found</h1>

              <p>Please go back and choose a product.</p>

              <a class="primary-button" href="Work_with_me.html">
                View all products
              </a>

            </div>`;
        }

        return;
      }

      // Display selected product information
      productImage.src = selectedProduct.image;
      productImage.alt = selectedProduct.title;

      document.getElementById("productCategory").textContent =
        selectedProduct.category;

      document.getElementById("productTitle").textContent =
        selectedProduct.title;

      document.getElementById("productPrice").textContent =
        "£" + Number(selectedProduct.price).toFixed(2);

      document.getElementById("productDescription").textContent =
        selectedProduct.description;

      document.getElementById("productDuration").textContent =
        selectedProduct.duration;

      document.getElementById("categoryBottom").textContent =
        selectedProduct.category;

      // ----------------------------------------------
      // PART 3: RELATED PRODUCTS SECTION
      // ----------------------------------------------

      const relatedProductsElement = document.getElementById("relatedProducts");

      if (relatedProductsElement) {
        // Exclude current product from related products
        const relatedProducts = products.filter(function (product) {
          return String(product.id) !== String(selectedProduct.id);
        });

        // Display remaining products as related products
        relatedProductsElement.innerHTML = relatedProducts
          .map(function (product) {
            return `
              <div class="col-lg-4 col-md-6">

                <a href="product.html?id=${encodeURIComponent(product.id)}"
                  class="product-card">

                  <!-- Related Product Image -->
                  <img src="${product.image}"
                    alt="${escapeHTML(product.title)}">

                  <div class="product-card-content">

                    <!-- Product Category -->
                    <span class="category-label">
                      ${escapeHTML(product.category)}
                    </span>

                    <!-- Product Name -->
                    <h2>${escapeHTML(product.title)}</h2>

                    <!-- Product Price -->
                    <p class="card-price">
                      £${Number(product.price).toFixed(2)}
                    </p>

                    <!-- Product Description -->
                    <p>${escapeHTML(product.description)}</p>

                    <!-- Product Duration -->
                    <small>
                      Duration: ${escapeHTML(product.duration)}
                    </small>

                  </div>

                </a>

              </div>`;
          })
          .join("");
      }

      // ----------------------------------------------
      // PART 4: DESCRIPTION AND REVIEWS TABS
      // ----------------------------------------------

      // Get tab buttons and their content sections
      const descriptionTab = document.getElementById("descriptionTab");
      const reviewsTab = document.getElementById("reviewsTab");

      const descriptionContent = document.getElementById("descriptionContent");

      const reviewsContent = document.getElementById("reviewsContent");

      // Check whether all tab elements exist
      if (
        descriptionTab &&
        reviewsTab &&
        descriptionContent &&
        reviewsContent
      ) {
        // Display description when Description tab is clicked
        descriptionTab.addEventListener("click", function () {
          // Update active tab styling
          descriptionTab.classList.add("active");
          reviewsTab.classList.remove("active");

          // Update accessibility attributes
          descriptionTab.setAttribute("aria-selected", "true");
          reviewsTab.setAttribute("aria-selected", "false");

          // Show description and hide reviews
          descriptionContent.classList.remove("d-none");
          reviewsContent.classList.add("d-none");
        });

        // Display reviews when Reviews tab is clicked
        reviewsTab.addEventListener("click", function () {
          // Update active tab styling
          reviewsTab.classList.add("active");
          descriptionTab.classList.remove("active");

          // Update accessibility attributes
          reviewsTab.setAttribute("aria-selected", "true");
          descriptionTab.setAttribute("aria-selected", "false");

          // Show reviews and hide description
          reviewsContent.classList.remove("d-none");
          descriptionContent.classList.add("d-none");
        });
      }

      // ----------------------------------------------
      // PART 5: PRODUCT IMAGE ZOOM
      // ----------------------------------------------

      const zoomButton = document.getElementById("zoomButton");

      if (zoomButton) {
        // Open enlarged image when zoom button is clicked
        zoomButton.addEventListener("click", function () {
          const zoomImage = document.getElementById("zoomImage");
          const modalElement = document.getElementById("imageModal");

          // Check whether modal elements and Bootstrap are available
          if (zoomImage && modalElement && window.bootstrap) {
            // Set enlarged image source
            zoomImage.src = selectedProduct.image;

            // Display Bootstrap image modal
            new bootstrap.Modal(modalElement).show();
          }
        });
      }

      // ----------------------------------------------
      // PART 6: ADD PRODUCT TO CART
      // ----------------------------------------------

      const addCartButton = document.getElementById("addCartButton");

      if (addCartButton) {
        // Add product when Add to Cart button is clicked
        addCartButton.addEventListener("click", function () {
          // Get quantity input and message element
          const quantityInput = document.getElementById("quantity");
          const message = document.getElementById("cartMessage");

          const quantity = Number(quantityInput.value);

          // Validate product quantity
          if (!Number.isInteger(quantity) || quantity < 1) {
            if (message) {
              message.textContent =
                "Please enter a valid quantity (1 or more).";
            }

            return;
          }

          // Get existing cart products
          const cart = getCart();

          // Check whether selected product already exists in cart
          const existingItem = cart.find(function (item) {
            return String(item.id) === String(selectedProduct.id);
          });

          // If product already exists, increase its quantity
          if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity) + quantity;
          } else {
            // Otherwise add new product to cart
            cart.push({
              id: selectedProduct.id,
              title: selectedProduct.title,
              price: Number(selectedProduct.price),
              image: selectedProduct.image,
              quantity: quantity,
            });
          }

          // Save updated cart data
          saveCart(cart);

          // Refresh cart sidebar and header information
          renderCart();

          // Display success message below Add to Cart button
          if (message) {
            message.textContent =
              '"' + selectedProduct.title + '" has been added to your cart.';
          }

          // Display cart notification at top of product page
          const notice = document.getElementById("cartNotice");
          const noticeText = document.getElementById("cartNoticeText");

          if (notice && noticeText) {
            noticeText.textContent =
              '"' + selectedProduct.title + '" has been added to your cart.';

            notice.classList.remove("d-none");
          }
        });
      }
    })

    // ----------------------------------------------
    // ERROR HANDLING
    // ----------------------------------------------

    .catch(function (error) {
      // Display error in browser console
      console.error("Error loading products:", error);

      const productList = document.getElementById("productList");
      const relatedProducts = document.getElementById("relatedProducts");

      // Show error if product listing cannot load
      if (productList) {
        productList.innerHTML = `
          <div class="col-12 empty-state">
            Could not load products.
            Please run this project with Live Server.
          </div>`;
      }

      // Show error if related products cannot load
      if (relatedProducts) {
        relatedProducts.innerHTML = `
          <div class="col-12 empty-state">
            Could not load related products.
          </div>`;
      }
    });
});

// ================== NewsLetter js =======================

document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.getElementById("newsletterForm");
  const successMessage = document.getElementById("successMessage");

  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();

    const selectedReasons = document.querySelectorAll(
      'input[name="reason"]:checked',
    );

    // Name validation
    if (name === "") {
      alert("Please enter your name.");
      return;
    }

    // Last Name validation
    if (lastName === "") {
      alert("Please enter your last name.");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Checkbox validation
    if (selectedReasons.length === 0) {
      alert("Please select at least one reason.");
      return;
    }

    // Get selected reasons
    const reasons = [];

    selectedReasons.forEach(function (checkbox) {
      reasons.push(checkbox.value);
    });

    // Console details
    console.log({
      name: name,
      lastName: lastName,
      email: email,
      reasons: reasons,
    });

    // Hide form
    newsletterForm.style.display = "none";

    // Show success message
    successMessage.style.display = "block";
  });
});
