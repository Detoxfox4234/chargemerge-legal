/* Film auf der Landingpage: großer Play-Knopf über dem Standbild.
   Das Video wird erst beim Klick geladen (preload="none" im HTML), startet nie von selbst
   und pausiert, sobald es aus dem Bild gescrollt wird.
   Ohne JavaScript bleiben die normalen Bedienelemente des Browsers sichtbar. */
(() => {
  const film = document.querySelector(".lp-film");
  if (!film) return;

  const video = film.querySelector("video");
  const button = film.querySelector(".lp-film-play");
  if (!video || !button) return;

  video.controls = false;
  button.hidden = false;

  const showControls = () => {
    button.hidden = true;
    video.controls = true;
  };

  button.addEventListener("click", () => {
    showControls();
    video.play().catch(() => {});
  });
  video.addEventListener("play", showControls);

  /* Der Film endet auf Schwarz: danach wieder Standbild und Play-Knopf zeigen.
     load() setzt das Video auf das Poster zurück; die Datei liegt dann schon im Browser-Cache. */
  video.addEventListener("ended", () => {
    if (document.fullscreenElement === video) document.exitFullscreen().catch(() => {});
    video.controls = false;
    video.load();
    button.hidden = false;
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused) video.pause();
    }, { threshold: 0.15 }).observe(film);
  }
})();
