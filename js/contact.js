// ================== Contact Form JS =======================

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const successcontent = document.getElementById("successcontent");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Get selected reminders
    const selectedReminders = document.querySelectorAll(
      'input[name="reminder"]:checked',
    );

    // First Name Validation
    if (firstName === "") {
      alert("Please enter your first name.");
      return;
    }

    // Last Name Validation
    if (lastName === "") {
      alert("Please enter your last name.");
      return;
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Checkbox Validation
    if (selectedReminders.length === 0) {
      alert("Please select at least one reminder.");
      return;
    }

    // Get selected reminders
    const reminders = [];

    selectedReminders.forEach(function (checkbox) {
      reminders.push(
        checkbox.value ||
          checkbox.parentElement.querySelector("span").textContent.trim(),
      );
    });

    // Console Details
    console.log({
      firstName: firstName,
      lastName: lastName,
      email: email,
      message: message,
      reminders: reminders,
    });

    // Hide Contact Form
    contactForm.style.display = "none";

    // Show Success Message
    successcontent.style.display = "block";
  });
});
