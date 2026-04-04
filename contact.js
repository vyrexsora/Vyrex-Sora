// INIT EMAILJS
(function() {
  emailjs.init("v8euLsyLia1rwby54");
})();

const form = document.getElementById("contact-form");
const box = document.getElementById("message-box");
const text = document.getElementById("message-text");
const okBtn = document.getElementById("message-btn");

function showBox(message, showButton = false) {
  text.innerText = message;
  okBtn.style.display = showButton ? "inline-block" : "none";
  box.classList.add("active");
}

function hideBox() {
  box.classList.remove("active");
}

okBtn.addEventListener("click", hideBox);

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const btn = form.querySelector("button");
  btn.disabled = true;

  // SHOW SENDING
  showBox("Sending...", false);

  emailjs.sendForm(
    "service_uu1nxha",
    "template_fjlbrfj",
    this
  )
  .then(() => {
    showBox("Message sent successfully!", true);
    form.reset();
  })
  .catch(() => {
    showBox("Failed to send message. Try again.", true);
  })
  .finally(() => {
    btn.disabled = false;
  });
});