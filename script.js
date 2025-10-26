(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const ICONS = {
    home: "M3 12l9-9 9 9v9a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5h-4v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    brain: "M9.5 4a3.5 3.5 0 0 0-3.5 3.5v9a3.5 3.5 0 0 0 3.5 3.5H10V4.5A.5.5 0 0 0 9.5 4zm5 0a.5.5 0 0 0-.5.5V20h.5a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 14.5 4z",
    refresh: "M4 4v6h6M20 20v-6h-6M5.5 18.5A8 8 0 0 0 19 13m-6-8a8 8 0 0 0-13 5",
    workflow: "M6 3h12v6H6zm0 12h5v6H6zm7 0h5v6h-5zM8 9v3m8-3v3m-4 0v3",
    shield: "M12 2l7 4v6c0 5-3.5 9.74-7 10-3.5-.26-7-5-7-10V6z"
  };

  const state = {
    sections: [],
    flat: [],
    activeTopicId: null,
    landingHTML: ""
  };

  function syncThemeToggle() {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    const button = $(".toggle-theme");
    if (!button) return;
    const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
    button.setAttribute("aria-label", label);
    const srOnly = button.querySelector(".sr-only");
    if (srOnly) srOnly.textContent = label;
  }

  window.toggleTheme = function toggleTheme() {
    const root = document.documentElement;
    const cur = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", cur === "light" ? "dark" : "light");
    syncThemeToggle();
  };

  const hexToRgba = (hex, alpha = 1) => {
    const clean = hex.replace('#', '');
    const value = clean.length === 3
      ? clean.split('').map(ch => ch + ch).join('')
      : clean;
    const num = parseInt(value, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const createIcon = (name, color) => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", color);
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", ICONS[name] || ICONS.home);
    svg.appendChild(path);
    return svg;
  };

  async function loadData() {
    const res = await fetch("topics.json", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar topics.json");

    const raw = await res.json();
    const hasSectionsArray = raw && Array.isArray(raw.sections);
    const sections = hasSectionsArray ? raw.sections : Array.isArray(raw) ? raw : null;
    if (!sections) throw new Error("Formato inválido de topics.json");

    state.sections = sections.map(section => {
      const topics = section && Array.isArray(section.topics) ? section.topics : [];
      return { ...section, topics };
    });

    state.flat = [];
    state.sections.forEach((section, sectionIndex) => {
      section.topics.forEach((topic, topicIndex) => {
        if (!topic || typeof topic !== "object") return;
        state.flat.push({ section, topic, sectionIndex, topicIndex });
      });
    });
  }

  function buildHeroCards() {
    const container = $("#sectionCards");
    if (!container) return;
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    state.sections.forEach((section) => {
      const card = document.createElement("article");
      card.className = "hero-card";
      card.style.background = `linear-gradient(135deg, ${hexToRgba(section.color, 0.92)}, ${hexToRgba(section.color, 0.72)})`;
      card.style.borderColor = hexToRgba(section.color, 0.65);

      const iconWrap = document.createElement("div");
      iconWrap.className = "icon";
      iconWrap.appendChild(createIcon(section.icon, "#FFFFFF"));

      const heading = document.createElement("h3");
      heading.appendChild(iconWrap);
      const titleSpan = document.createElement("span");
      titleSpan.textContent = section.title;
      heading.appendChild(titleSpan);

      const description = document.createElement("p");
      description.textContent = section.description;

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `${section.topics.length} módulos prácticos`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-ghost btn-link";
      button.innerHTML = 'Explorar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>';
      button.addEventListener("click", () => loadTopic(section.topics[0]?.id));

      card.appendChild(heading);
      card.appendChild(description);
      card.appendChild(meta);
      card.appendChild(button);
      frag.appendChild(card);
    });
    container.appendChild(frag);
  }

  function buildMenu() {
    const menu = $("#menu");
    if (!menu) return;
    menu.innerHTML = "";

    const frag = document.createDocumentFragment();
    state.sections.forEach((section, index) => {
      const sectionItem = document.createElement("li");
      sectionItem.className = "menu-section";
      sectionItem.setAttribute("role", "treeitem");
      sectionItem.dataset.sectionId = section.id;
      sectionItem.style.borderColor = hexToRgba(section.color, 0.35);

      const headerBtn = document.createElement("button");
      headerBtn.type = "button";
      headerBtn.className = "menu-section-header";
      headerBtn.dataset.tooltip = section.tooltip;
      headerBtn.style.color = section.color;
      headerBtn.setAttribute("aria-expanded", index === 0 ? "true" : "false");

      const icon = document.createElement("span");
      icon.className = "icon";
      icon.style.background = hexToRgba(section.color, 0.18);
      icon.appendChild(createIcon(section.icon, section.color));

      const label = document.createElement("span");
      label.textContent = section.title;

      headerBtn.appendChild(icon);
      headerBtn.appendChild(label);
      headerBtn.addEventListener("click", () => toggleSection(sectionItem));

      const sublist = document.createElement("ul");
      sublist.className = "menu-sublist";
      sublist.setAttribute("role", "group");
      sublist.hidden = index !== 0;

      section.topics.forEach((topic) => {
        const item = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = topic.title;
        btn.dataset.id = topic.id;
        btn.addEventListener("click", () => {
          loadTopic(topic.id);
          closeMenuOnMobile();
        });
        item.appendChild(btn);
        sublist.appendChild(item);
      });

      sectionItem.appendChild(headerBtn);
      sectionItem.appendChild(sublist);
      frag.appendChild(sectionItem);
    });
    menu.appendChild(frag);
  }

  function toggleSection(sectionItem) {
    const expanded = sectionItem.querySelector(".menu-section-header");
    const sublist = sectionItem.querySelector(".menu-sublist");
    const isExpanded = expanded?.getAttribute("aria-expanded") === "true";
    if (expanded) expanded.setAttribute("aria-expanded", String(!isExpanded));
    if (sublist) sublist.hidden = isExpanded;
  }

  function findTopic(topicId) {
    return state.flat.find(entry => entry.topic.id === topicId) || null;
  }

  function renderLanding() {
    const breadcrumbs = $("#breadcrumbs");
    if (breadcrumbs) {
      breadcrumbs.innerHTML = "";
      const li = document.createElement("li");
      li.textContent = "Inicio";
      breadcrumbs.appendChild(li);
    }
    const content = $("#content");
    if (content) {
      content.innerHTML = state.landingHTML;
      content.classList.remove("technique-view");
      state.activeTopicId = null;
      content.focus({ preventScroll: true });
    }
    document.title = "El Arte de los Prompts";
    $$(".menu-sublist button").forEach(btn => btn.classList.remove("active"));
  }

  function setBreadcrumbs(section, topic) {
    const breadcrumbs = $("#breadcrumbs");
    if (!breadcrumbs) return;
    breadcrumbs.innerHTML = "";
    const items = [
      { label: "Inicio", action: () => renderLanding() },
      { label: section.title, action: () => loadTopic(section.topics[0]?.id) },
      { label: topic.title }
    ];
    items.forEach((item, idx) => {
      const li = document.createElement("li");
      if (item.action && idx !== items.length - 1) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = item.label;
        btn.className = "link-button";
        btn.addEventListener("click", item.action);
        li.appendChild(btn);
      } else {
        li.textContent = item.label;
      }
      breadcrumbs.appendChild(li);
    });
  }

  function createBadge(iconPath, text) {
    const badge = document.createElement("span");
    badge.className = "badge";
    if (iconPath) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "1.8");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", iconPath);
      svg.appendChild(path);
      badge.appendChild(svg);
    }
    badge.appendChild(document.createTextNode(text));
    return badge;
  }

  function renderTopic(topicId) {
    const entry = findTopic(topicId);
    if (!entry) {
      renderLanding();
      return;
    }
    state.activeTopicId = entry.topic.id;
    const { section, topic } = entry;

    setBreadcrumbs(section, topic);
    document.title = `${topic.title} · El Arte de los Prompts`;

    const content = $("#content");
    if (!content) return;
    content.classList.add("technique-view");
    content.innerHTML = "";

    const header = document.createElement("header");
    header.className = "technique-header";
    const title = document.createElement("h2");
    title.textContent = topic.title;
    const summary = document.createElement("p");
    summary.textContent = topic.summary;

    const meta = document.createElement("div");
    meta.className = "technique-meta";
    meta.appendChild(createBadge("M12 20v-4M12 4V2M4 12H2m20 0h-2", `Dificultad: ${topic.difficulty}`));
    meta.appendChild(createBadge("M3 8h18M3 16h18", `Tiempo estimado: ${topic.time}`));

    header.appendChild(title);
    header.appendChild(summary);
    header.appendChild(meta);
    content.appendChild(header);

    const layout = document.createElement("div");
    layout.className = "technique-layout";

    const main = document.createElement("section");
    main.className = "technique-main";

    const definition = document.createElement("section");
    const defTitle = document.createElement("h3");
    defTitle.textContent = "Definición";
    const defText = document.createElement("p");
    defText.textContent = topic.definition;
    definition.appendChild(defTitle);
    definition.appendChild(defText);

    const whenBlock = document.createElement("section");
    const whenTitle = document.createElement("h3");
    whenTitle.textContent = "Cuándo usarla";
    const whenText = document.createElement("p");
    whenText.textContent = topic.when;
    whenBlock.appendChild(whenTitle);
    whenBlock.appendChild(whenText);

    const steps = document.createElement("section");
    const stepsTitle = document.createElement("h3");
    stepsTitle.textContent = "Pasos clave";
    const stepsList = document.createElement("ol");
    stepsList.className = "step-list";
    topic.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsList.appendChild(li);
    });
    steps.appendChild(stepsTitle);
    steps.appendChild(stepsList);

    const exampleDetails = document.createElement("details");
    exampleDetails.className = "block-expandable";
    const summaryEl = document.createElement("summary");
    summaryEl.textContent = `Ver ejemplo: ${topic.example.title}`;
    const exampleBody = document.createElement("div");
    const context = document.createElement("p");
    context.textContent = topic.example.context;
    exampleBody.appendChild(context);
    const copyWrapper = document.createElement("div");
    copyWrapper.className = "copy-wrapper";
    if (topic.example.copy) {
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "copy-btn";
      copyBtn.dataset.copy = topic.example.prompt;
      copyBtn.textContent = "Copiar prompt";
      copyWrapper.appendChild(copyBtn);
    }
    const pre = document.createElement("pre");
    pre.className = "copy-area";
    pre.textContent = topic.example.prompt;
    copyWrapper.appendChild(pre);
    exampleBody.appendChild(copyWrapper);
    exampleDetails.appendChild(summaryEl);
    exampleDetails.appendChild(exampleBody);

    const errorsBlock = document.createElement("section");
    const errorsTitle = document.createElement("h3");
    errorsTitle.textContent = "Errores comunes";
    const errorsList = document.createElement("ul");
    errorsList.className = "error-list";
    topic.errors.forEach(err => {
      const li = document.createElement("li");
      li.textContent = err;
      errorsList.appendChild(li);
    });
    errorsBlock.appendChild(errorsTitle);
    errorsBlock.appendChild(errorsList);

    const practiceBlock = document.createElement("section");
    const practiceTitle = document.createElement("h3");
    practiceTitle.textContent = "Buenas prácticas";
    const practiceList = document.createElement("ul");
    practiceList.className = "practice-list";
    topic.bestPractices.forEach(practice => {
      const li = document.createElement("li");
      li.textContent = practice;
      practiceList.appendChild(li);
    });
    practiceBlock.appendChild(practiceTitle);
    practiceBlock.appendChild(practiceList);

    main.appendChild(definition);
    main.appendChild(whenBlock);
    main.appendChild(steps);
    main.appendChild(exampleDetails);
    main.appendChild(errorsBlock);
    main.appendChild(practiceBlock);

    layout.appendChild(main);

    const aside = document.createElement("aside");
    aside.className = "technique-aside";

    if (topic.resources?.length) {
      const resourceCard = document.createElement("div");
      resourceCard.className = "aside-card";
      const rTitle = document.createElement("h3");
      rTitle.textContent = "Recursos";
      const list = document.createElement("ul");
      list.className = "resource-list";
      topic.resources.forEach(res => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = res.href;
        link.textContent = res.label;
        li.appendChild(link);
        if (res.description) {
          const meta = document.createElement("small");
          meta.textContent = ` · ${res.description}`;
          li.appendChild(meta);
        }
        list.appendChild(li);
      });
      resourceCard.appendChild(rTitle);
      resourceCard.appendChild(list);
      aside.appendChild(resourceCard);
    }

    if (topic.notes?.length) {
      const notesCard = document.createElement("div");
      notesCard.className = "aside-card";
      const nTitle = document.createElement("h3");
      nTitle.textContent = "Notas clave";
      const list = document.createElement("ul");
      list.className = "notes-list";
      topic.notes.forEach(note => {
        const li = document.createElement("li");
        li.textContent = note;
        list.appendChild(li);
      });
      notesCard.appendChild(nTitle);
      notesCard.appendChild(list);
      aside.appendChild(notesCard);
    }

    if (topic.related?.length) {
      const relatedDetails = document.createElement("details");
      relatedDetails.className = "aside-card";
      relatedDetails.open = true;
      const summary = document.createElement("summary");
      summary.textContent = "Técnicas relacionadas";
      const list = document.createElement("div");
      const relatedList = document.createElement("div");
      relatedList.className = "related-list";
      topic.related.forEach(id => {
        const relatedEntry = findTopic(id);
        if (!relatedEntry) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = relatedEntry.topic.title;
        btn.addEventListener("click", () => loadTopic(id));
        relatedList.appendChild(btn);
      });
      list.appendChild(relatedList);
      relatedDetails.appendChild(summary);
      relatedDetails.appendChild(list);
      aside.appendChild(relatedDetails);
    }

    layout.appendChild(aside);
    content.appendChild(layout);

    const nav = document.createElement("div");
    nav.className = "nav-buttons";
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "btn btn-secondary";
    prevBtn.textContent = "Técnica anterior";
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn btn-primary";
    nextBtn.textContent = "Siguiente técnica";

    const index = state.flat.findIndex(item => item.topic.id === topic.id);
    const prev = state.flat[index - 1];
    const next = state.flat[index + 1];

    if (prev) {
      prevBtn.addEventListener("click", () => loadTopic(prev.topic.id));
    } else {
      prevBtn.disabled = true;
    }

    if (next) {
      nextBtn.addEventListener("click", () => loadTopic(next.topic.id));
    } else {
      nextBtn.disabled = true;
    }

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    content.appendChild(nav);

    highlightMenuItem(topic.id);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      content.scrollIntoView({ block: "start" });
    } else {
      content.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    content.focus({ preventScroll: true });
  }

  function highlightMenuItem(topicId) {
    $$(".menu-sublist button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.id === topicId);
    });
  }

  function loadTopic(topicId) {
    renderTopic(topicId);
  }

  function closeMenuOnMobile() {
    const sidebar = $("#sidebar");
    const handle = $("#menuHandle");
    if (window.innerWidth <= 1024) {
      sidebar?.classList.remove("open");
      handle?.setAttribute("aria-expanded", "false");
    }
  }

  function setupMenuHandle() {
    const handle = $("#menuHandle");
    const sidebar = $("#sidebar");
    if (!handle || !sidebar) return;
    handle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      handle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function setupReaderToggle() {
    const btn = $("#readerToggle");
    const sidebar = $("#sidebar");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isActive = document.body.classList.toggle("reader-mode");
      btn.setAttribute("aria-pressed", String(isActive));
      btn.textContent = isActive ? "Salir de modo lectura" : "Modo lectura";
      sidebar?.classList.toggle("hidden", isActive);
    });
  }

  function setupCTA() {
    const btn = $("#ctaStart");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const first = state.flat[0];
      if (first) loadTopic(first.topic.id);
    });
  }

  function setupCopy() {
    document.addEventListener("click", (event) => {
      const btn = event.target.closest(".copy-btn[data-copy]");
      if (!btn) return;
      const text = btn.dataset.copy || "";
      navigator.clipboard?.writeText(text).then(() => {
        btn.classList.add("copied");
        btn.textContent = "Copiado";
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.textContent = "Copiar prompt";
        }, 1600);
      }).catch(() => {
        btn.textContent = "Intenta nuevamente";
      });
    });
  }

  function setupShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        const sidebar = $("#sidebar");
        const handle = $("#menuHandle");
        const isOpen = sidebar?.classList.toggle("open");
        handle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        document.body.classList.toggle("focus-mode");
        if (!document.body.classList.contains("focus-mode")) {
          $("#content")?.focus?.();
        }
      } else if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        toggleTheme();
      }
    });
  }

  window.addEventListener("load", async () => {
    try {
      const content = $("#content");
      if (content) state.landingHTML = content.innerHTML;
      await loadData();
      buildHeroCards();
      buildMenu();
      setupMenuHandle();
      setupReaderToggle();
      setupCTA();
      setupCopy();
      setupShortcuts();
      syncThemeToggle();
    } catch (error) {
      console.error(error);
      const content = $("#content");
      if (content) content.innerHTML = "<p>No se pudo cargar el contenido. Revisa <code>topics.json</code>.</p>";
    }
  });
})();
