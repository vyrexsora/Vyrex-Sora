// LAST UPDATED DATE
const dateEl = document.getElementById("lastUpdated");
const today = new Date();
dateEl.textContent = today.toDateString();

// SCROLL REVEAL
const cards = document.querySelectorAll(".terms-card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.15
});

cards.forEach(card => {
  observer.observe(card);
});