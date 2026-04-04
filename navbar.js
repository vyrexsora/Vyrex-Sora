// NAV TOGGLE
const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.onclick = () => {
  navLinks.classList.toggle("active");
};