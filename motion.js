/* Bewegungseffekte für alle Seiten: Einblenden beim Scrollen, schwebende Kopfzeile,
   weich aufklappende FAQ. Reine Zugabe – ohne JavaScript, ohne IntersectionObserver
   oder bei „Bewegung reduzieren“ bleibt die Seite vollständig sichtbar und statisch.
   Wird bewusst ohne `defer` im <head> geladen, damit `has-motion` vor dem ersten
   Zeichnen gesetzt ist und die Einstiegsanimation nicht aufblitzt. */
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;

  const root = document.documentElement;
  root.classList.add("has-motion");

  /* Auswahl → Art des Einblendens (rise = aufsteigen, zoom = aufsteigen + heranzoomen, fade = nur einblenden) */
  const TARGETS = [
    [".lp-facts > li", "rise"],
    [".lp-film", "zoom"],
    [".lp-section-head", "rise"],
    [".lp-feature-text", "rise"],
    [".lp-window, .lp-phone-shot", "zoom"],
    [".lp-import-cards > .luxury-card", "rise"],
    [".lp-phones > li", "rise"],
    [".lp-privacy", "rise"],
    [".lp-plan", "rise"],
    [".lp-plans-note", "fade"],
    [".lp-faq > details", "rise"],
    [".lp-cta", "zoom"],
    [".page-shell .section-divider", "rise"],
    [".page-shell main > .luxury-card, .page-shell .card-grid > .luxury-card", "rise"],
    [".site-footer, .lp-legal-note", "fade"]
  ];

  const STAGGER_MS = 90;
  const MAX_STAGGER_STEPS = 5;
  const CLEANUP_MS = 1800;

  /* Entfernt alle Spuren, damit das Element danach exakt wie im statischen Layout dasteht. */
  const release = (el) => {
    el.removeAttribute("data-reveal");
    el.classList.remove("is-revealed");
    el.style.removeProperty("--reveal-delay");
  };

  const setupReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      let step = 0;
      for (const entry of entries) {
        const el = entry.target;
        if (entry.isIntersecting) {
          const delay = Math.min(step, MAX_STAGGER_STEPS) * STAGGER_MS;
          step += 1;
          el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.classList.add("is-revealed");
          observer.unobserve(el);
          setTimeout(release, CLEANUP_MS + delay, el);
        } else if (entry.boundingClientRect.bottom < 0) {
          /* Bereits überscrollt (Sprungmarke, wiederhergestellte Scroll-Position): sofort zeigen. */
          observer.unobserve(el);
          release(el);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    for (const [selector, kind] of TARGETS) {
      for (const el of document.querySelectorAll(selector)) {
        if (el.hasAttribute("data-reveal")) continue;
        if (el.getBoundingClientRect().bottom < 0) continue;
        el.setAttribute("data-reveal", kind);
        observer.observe(el);
      }
    }
  };

  /* Kopfzeile bekommt den Glas-Hintergrund, sobald die Seite gescrollt ist. */
  const setupHeader = () => {
    const bar = document.querySelector(".top-bar");
    if (!bar) return;
    let queued = false;
    const update = () => {
      queued = false;
      bar.classList.toggle("is-stuck", window.scrollY > 12);
    };
    window.addEventListener("scroll", () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  };

  /* FAQ: Höhe beim Auf- und Zuklappen animieren statt springen. */
  const setupFaq = () => {
    for (const details of document.querySelectorAll(".lp-faq details")) {
      const summary = details.querySelector("summary");
      if (!summary || typeof details.animate !== "function") continue;

      let animation = null;
      let closing = false;

      const run = (from, to, openAfter) => {
        details.style.overflow = "hidden";
        animation = details.animate(
          { height: [`${from}px`, `${to}px`] },
          { duration: 340, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" }
        );
        animation.onfinish = () => {
          details.open = openAfter;
          details.style.overflow = "";
          details.classList.remove("is-closing");
          animation = null;
          closing = false;
        };
      };

      summary.addEventListener("click", (event) => {
        event.preventDefault();
        const from = details.offsetHeight;
        if (animation) {
          animation.onfinish = null;
          animation.cancel();
        }

        if (details.open && !closing) {
          closing = true;
          details.classList.add("is-closing");
          const border = details.offsetHeight - details.clientHeight;
          run(from, summary.offsetHeight + border, false);
        } else {
          closing = false;
          details.classList.remove("is-closing");
          details.open = true;
          run(from, details.offsetHeight, true);
        }
      });
    }
  };

  const init = () => {
    setupReveal();
    setupHeader();
    setupFaq();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
