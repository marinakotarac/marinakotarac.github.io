(function () {
  const databases = {
    serbian: window.BOOK_DATABASES_SERBIAN,
    other: window.BOOK_DATABASES_OTHER,
  };
  const themes = ["blue", "green", "red"];

  function normalizeText(value) {
    return (value || "")
      .toLocaleLowerCase("sr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function sortItems(items) {
    return [...items].sort((left, right) => {
      const byName = left.localName.localeCompare(right.localName, "sr", { sensitivity: "base" });
      if (byName !== 0) {
        return byName;
      }
      return left.title.localeCompare(right.title, "sr", { sensitivity: "base" });
    });
  }

  function pickTheme() {
    const theme = themes[Math.floor(Math.random() * themes.length)];
    document.body.dataset.theme = theme;
  }

  function createSummaryCards() {
    const container = document.getElementById("summary-cards");
    if (!container) {
      return;
    }

    const sections = [
      { key: "serbian", href: "srpski.html" },
      { key: "other", href: "strani.html" },
    ];

    container.innerHTML = sections
      .map(({ key, href }) => {
        const database = databases[key];
        return `
          <a class="summary-card" href="${href}">
            <strong>${database.title}</strong>
            <span>${database.description}</span>
            <span class="count">${database.items.length} knjiga u bazi</span>
          </a>
        `;
      })
      .join("");
  }

  function createBookCard(item) {
    return `
      <article class="book-card">
        <div class="book-meta">
          <h3>${item.localName}</h3>
          <a href="${item.wikiUrl}" target="_blank" rel="noreferrer">${item.englishName}</a>
          <p class="book-copy">${item.title}</p>
        </div>
        <div class="thumb-row">
          <a class="thumb-link" href="${item.coverImage}" data-lightbox-image="${item.coverImage}" data-lightbox-alt="Naslovna strana za ${item.localName}">
            <img src="${item.coverThumb}" alt="Naslovna strana za ${item.localName}" width="50">
            <span>Naslovna strana</span>
          </a>
          <a class="thumb-link" href="${item.firstPageImage}" data-lightbox-image="${item.firstPageImage}" data-lightbox-alt="Prva strana za ${item.localName}">
            <img src="${item.firstPageThumb}" alt="Prva strana za ${item.localName}" width="50">
            <span>Prva strana</span>
          </a>
        </div>
      </article>
    `;
  }

  function ensureLightbox() {
    let overlay = document.getElementById("lightbox-overlay");
    if (overlay) {
      return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = "lightbox-overlay";
    overlay.className = "lightbox-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="lightbox-frame">
        <img id="lightbox-image" src="" alt="">
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function setupLightbox() {
    const overlay = ensureLightbox();
    const image = document.getElementById("lightbox-image");
    const close = () => {
      overlay.hidden = true;
      image.src = "";
      image.alt = "";
      document.body.classList.remove("lightbox-open");
    };

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox-image]");
      if (!trigger) {
        return;
      }

      event.preventDefault();
      image.src = trigger.dataset.lightboxImage;
      image.alt = trigger.dataset.lightboxAlt || "";
      overlay.hidden = false;
      document.body.classList.add("lightbox-open");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) {
        close();
      }
    });

    overlay.addEventListener("click", close);
  }

  function mountCatalog(key) {
    const database = databases[key];
    const title = document.getElementById("catalog-title");
    const description = document.getElementById("catalog-description");
    const input = document.getElementById("catalog-search");
    const stats = document.getElementById("catalog-stats");
    const list = document.getElementById("catalog-list");
    const items = sortItems(database.items);

    title.textContent = database.title;
    description.textContent = database.description;

    function render() {
      const query = normalizeText(input.value);
      const filtered = items.filter((item) => {
        if (!query) {
          return true;
        }

        const haystack = normalizeText(`${item.localName} ${item.englishName}`);
        return haystack.includes(query);
      });

      stats.textContent = `Prikazano ${filtered.length} jezika od ${items.length}.`;

      if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state">Nema rezultata za uneti pojam.</div>';
        return;
      }

      list.innerHTML = filtered.map(createBookCard).join("");
    }

    input.addEventListener("input", render);
    render();
  }

  pickTheme();
  setupLightbox();
  if (document.body.dataset.page === "home") {
    createSummaryCards();
  }

  if (document.body.dataset.page === "catalog") {
    mountCatalog(document.body.dataset.database);
  }
})();
