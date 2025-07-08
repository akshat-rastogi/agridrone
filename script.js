function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(id).style.display = "block";
}
// Show home section by default on page load
window.onload = function () {
  showSection("home");
};
