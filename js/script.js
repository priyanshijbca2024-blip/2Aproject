document.addEventListener("DOMContentLoaded", function () {
  fetch("packages.json")
    .then(function (response) {
      return response.json();
    })

    .then(function (packages) {
      const container = document.getElementById("packagesContainer");

      packages.forEach(function (packageItem) {
        const card = `

                    <div class="col-lg-3 col-md-6">

                        <div class="package-card">

                            <img
                                src="${packageItem.image}"
                                alt="${packageItem.title}"
                                class="img-fluid package-image">

                            <h5 class="package-title">
                                ${packageItem.title}
                            </h5>

                            <h6 class="package-price">
                                ${packageItem.price}
                            </h6>

                            <p class="package-description">
                                ${packageItem.description}
                            </p>

                            <p class="package-duration">
                                Duration : ${packageItem.duration}
                            </p>

                        </div>

                    </div>

                `;

        container.innerHTML += card;
      });
    })

    .catch(function (error) {
      console.log("Error loading packages:", error);
    });
});

// ================= CART =================

let cartCount = 0;

const cartButton = document.getElementById("cartButton");
const cartCountElement = document.getElementById("cartCount");

cartButton.addEventListener("click", function () {
  cartCount++;

  cartCountElement.textContent = cartCount;
});

// ================= NEWSLETTER FORM =================

const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;

  if (firstName === "" || lastName === "" || email === "") {
    alert("Please fill all required fields.");

    return;
  }

  alert("Thank you for subscribing!");

  newsletterForm.reset();
});

// ----------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  // Get HTML Elements

  const cartForm = document.getElementById("cartForm");

  const quantityInput = document.getElementById("quantity");

  const cartMessage = document.getElementById("cartMessage");

  // Add To Cart Event

  cartForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get Quantity Value

    const quantity = Number(quantityInput.value);

    // Check Quantity

    if (!Number.isInteger(quantity) || quantity < 1) {
      cartMessage.textContent = "Please enter a valid quantity.";

      return;
    }

    // Display Message

    cartMessage.textContent = quantity + " item(s) added to your cart.";
  });
});
