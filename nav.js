/* Mobiles Menü (Hamburger) für alle Seiten.
   Ohne JavaScript bleiben die Navigationslinks einfach sichtbar. */
(() => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("hauptmenue");
  if (!toggle || !menu) return;

  document.documentElement.classList.add("has-nav-toggle");
  toggle.hidden = false;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
})();
