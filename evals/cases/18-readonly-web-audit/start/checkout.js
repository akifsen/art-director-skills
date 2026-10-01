const form = document.getElementById("pay");
const ok = document.querySelector(".ok");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ok.hidden = false;
  setTimeout(() => {
    ok.textContent = "Paid — thanks!";
  }, 400);
});
