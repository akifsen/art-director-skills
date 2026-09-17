const input = document.getElementById("q");
const rows = [...document.querySelectorAll("[data-inv]")];
if (input) {
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    rows.forEach((row) => {
      row.hidden = q !== "" && !row.textContent.toLowerCase().includes(q);
    });
  });
}
