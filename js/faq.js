// ================= FAQ Section =================

document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
      const faqId = this.getAttribute("data-faq");

      const answer = document.getElementById(faqId);

      const icon = this.querySelector(".faq-icon");

      // Check if clicked FAQ is already open
      const isOpen = answer.classList.contains("active");

      // Close all FAQ answers
      document.querySelectorAll(".faq-answer").forEach(function (item) {
        item.classList.remove("active");
        item.style.maxHeight = null;
      });

      // Reset all icons to plus
      document.querySelectorAll(".faq-icon").forEach(function (item) {
        item.textContent = "+";
      });

      // Open clicked FAQ if it was closed
      if (!isOpen) {
        answer.classList.add("active");

        answer.style.maxHeight = answer.scrollHeight + "px";

        icon.textContent = "−";
      }
    });
  });
});
