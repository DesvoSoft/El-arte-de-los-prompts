(() => {
  "use strict";

  // ---------- Helpers ----------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => r.querySelectorAll(s);

  // ---------- Tema (botón del HTML) ----------
  window.toggleTheme = function () {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", cur === "light" ? "dark" : "light");
  };

  // ---------- Estado ----------
  let TOPICS = []; // [{ id, title, category?, html }]

  // ---------- Cargar contenido ----------
  async function loadTopics() {
    const res = await fetch("topics.json", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar topics.json");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Formato inválido de topics.json");
    TOPICS = data;
  }

  const getTopic = id => TOPICS.find(t => t.id === id);

  // ---------- Render de contenido (fix scroll raro) ----------
  function loadTopic(id) {
    const t = getTopic(id);
    const content = $("#topicContent");
    if (!content) return;

    // 1) actualiza contenido
    content.innerHTML = t ? t.html : "<p>Contenido no disponible.</p>";

    // 2) marca activo en menú
    $$(".menu button").forEach(b => b.classList.toggle("active", b.dataset.id === id));

    // 3) accesibilidad: foco sin desplazar
    const main = $("#main");
    if (main && main !== document.activeElement) {
      try { main.focus({ preventScroll: true }); } catch (_) {}
    }

    // 4) SOLO si está muy abajo, acerca el contenido (una sola animación)
    const y = window.scrollY || window.pageYOffset;
    if (y > 400) {
      content.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // ---------- Menú ----------
  function buildMenu() {
    const menu = $("#menu");
    if (!menu || !TOPICS.length) return;
    menu.innerHTML = "";

    // Agrupar por categoría si existe
    const byCat = new Map();
    for (const t of TOPICS) {
      const cat = (t.category || "Contenido").trim();
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push(t);
    }

    const frag = document.createDocumentFragment();
    for (const [cat, items] of byCat) {
      if (byCat.size > 1) {
        const titleLi = document.createElement("li");
        titleLi.innerHTML = `<div class="sidebar-title">${cat}</div>`;
        frag.appendChild(titleLi);
      }
      for (const t of items) {
        const li  = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";               // evita submit/reload si hubiera un form ancestro
        btn.dataset.id = t.id;
        btn.textContent = t.title;
        li.appendChild(btn);
        frag.appendChild(li);
      }
    }
    menu.appendChild(frag);

    // Delegación (y evitar navegaciones accidentales)
    menu.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      loadTopic(btn.dataset.id);
    }, { passive: false });
  }

  // ---------- Modo lectura ----------
  function addReaderToggle() {
    const css = `
      .reader-toggle{
        position:fixed;bottom:1rem;right:1rem;z-index:9999;border:0;border-radius:999px;
        padding:.65rem .95rem;font-weight:600;cursor:pointer;
        background:linear-gradient(135deg,var(--accent-2),var(--accent-4));
        color:#0b0d12;box-shadow:0 10px 20px rgba(0,0,0,.25)
      }
      .sidebar.hidden-by-reader{display:none!important}
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const btn = document.createElement("button");
    btn.className = "reader-toggle";
    btn.type = "button";
    btn.title = "Modo lectura (oculta/mostrar la barra lateral)";
    btn.textContent = "Modo lectura";
    btn.addEventListener("click", () => {
      const sb = $(".sidebar");
      if (sb) sb.classList.toggle("hidden-by-reader");
    });
    document.body.appendChild(btn);
  }

  // ---------- Guard de rendimiento (auto) ----------
  (function perfGuard() {
    const mem = navigator.deviceMemory || 0;
    const lowMem = mem && mem <= 4;

    let frames = 0;
    const start = performance.now();
    function tick(now) {
      frames++;
      if (now - start < 500) requestAnimationFrame(tick);
      else {
        const fps = frames * 2; // 500ms -> x2
        if (lowMem || fps < 45) document.body.classList.add("perf-low");
      }
    }
    requestAnimationFrame(tick);
  })();

  // ---------- Init ----------
  window.addEventListener("load", async () => {
    try {
      await loadTopics();
      buildMenu();
      addReaderToggle();
      // Abre una técnica por defecto si quieres:
      // if (TOPICS[0]) loadTopic(TOPICS[0].id);
    } catch (err) {
      console.error(err);
      const content = $("#topicContent");
      if (content) content.innerHTML = "<p>No se pudo cargar el contenido. Verifica <code>topics.json</code>.</p>";
    }
  });

  // ---------- Extra: robustez ante Enter/Space en botones (teclado) ----------
  // (La mayoría de navegadores ya lo manejan, pero por si acaso)
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.matches(".menu button[data-id]")) {
      e.preventDefault();
      e.stopPropagation();
      loadTopic(e.target.dataset.id);
    }
  }, { passive: false });

})();
