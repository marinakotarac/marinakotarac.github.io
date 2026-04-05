(function () {
  const databases = {
    serbian: {
      ...window.BOOK_DATABASES_SERBIAN,
      englishTitle: "Books in Serbian",
      englishDescription: "Physical Serbian editions in Marina Kotarac's collection, including Latin, Cyrillic, and special editions.",
    },
    other: {
      ...window.BOOK_DATABASES_OTHER,
      englishTitle: "Books in Other Languages",
      englishDescription: "Translations and multilingual editions from Marina Kotarac's physical collection in languages other than Serbian.",
    },
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

  function getSerbianPlural(value, forms) {
    const absolute = Math.abs(value);
    const lastTwo = absolute % 100;
    const last = absolute % 10;

    if (lastTwo >= 11 && lastTwo <= 14) {
      return forms.many;
    }

    if (last === 1) {
      return forms.one;
    }

    if (last >= 2 && last <= 4) {
      return forms.few;
    }

    return forms.many;
  }

  function formatSerbianCount(value, forms) {
    return `${value} ${getSerbianPlural(value, forms)}`;
  }

  function formatEnglishCount(value, singular, plural) {
    return `${value} ${value === 1 ? singular : plural}`;
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
      {
        type: "database",
        key: "serbian",
        href: "srpski.html",
        englishTitle: "Books in Serbian",
        englishDescription: "Physical Serbian editions in Marina Kotarac's collection.",
      },
      {
        type: "database",
        key: "other",
        href: "strani.html",
        englishTitle: "Books in Other Languages",
        englishDescription: "Translations and multilingual editions from Marina Kotarac's physical collection.",
      },
      {
        type: "static",
        href: "#razmena",
        title: "Knjige za razmenu",
        description: "Poseban sektor za duplikate i izdanja namenjena budućim razmenama sa kolekcionarima.",
        englishTitle: "Books for Exchange",
        englishDescription: "A dedicated section for duplicates and editions intended for future exchanges.",
        countLabel: "Kontakt i najava budućih primeraka",
        englishCountLabel: "Contact and upcoming exchange copies",
      },
    ];

    container.innerHTML = sections
      .map((section) => {
        if (section.type === "static") {
          return `
            <a class="summary-card" href="${section.href}">
              <strong>${section.title}</strong>
              <span>${section.description}</span>
              <strong>${section.englishTitle}</strong>
              <span>${section.englishDescription}</span>
              <span class="count">
                <span>${section.countLabel}</span>
                <span>${section.englishCountLabel}</span>
              </span>
            </a>
          `;
        }

        const database = databases[section.key];
        return `
          <a class="summary-card" href="${section.href}">
            <strong>${database.title}</strong>
            <span>${database.description}</span>
            <strong>${section.englishTitle}</strong>
            <span>${section.englishDescription}</span>
            <span class="count">
              <span>${formatSerbianCount(database.items.length, { one: "knjiga", few: "knjige", many: "knjiga" })} u bazi</span>
              <span>${formatEnglishCount(database.items.length, "book", "books")} in database</span>
            </span>
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
            <span>Cover</span>
          </a>
          <a class="thumb-link" href="${item.firstPageImage}" data-lightbox-image="${item.firstPageImage}" data-lightbox-alt="Prva strana za ${item.localName}">
            <img src="${item.firstPageThumb}" alt="Prva strana za ${item.localName}" width="50">
            <span>Prva strana</span>
            <span>First page</span>
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
    const englishTitle = document.getElementById("catalog-title-english");
    const description = document.getElementById("catalog-description");
    const englishDescription = document.getElementById("catalog-description-english");
    const input = document.getElementById("catalog-search");
    const stats = document.getElementById("catalog-stats");
    const list = document.getElementById("catalog-list");
    const items = sortItems(database.items);

    title.textContent = database.title;
    if (englishTitle) {
      englishTitle.textContent = database.englishTitle;
    }
    description.textContent = database.description;
    if (englishDescription) {
      englishDescription.textContent = database.englishDescription;
    }

    function render() {
      const query = normalizeText(input.value);
      const filtered = items.filter((item) => {
        if (!query) {
          return true;
        }

        const haystack = normalizeText(`${item.localName} ${item.englishName}`);
        return haystack.includes(query);
      });

      stats.innerHTML = `
        <span>Prikazano ${formatSerbianCount(filtered.length, { one: "jezik", few: "jezika", many: "jezika" })} od ${formatSerbianCount(items.length, { one: "jezika", few: "jezika", many: "jezika" })}.</span>
        <span>Showing ${formatEnglishCount(filtered.length, "language", "languages")} out of ${formatEnglishCount(items.length, "language", "languages")}.</span>
      `;

      if (filtered.length === 0) {
        list.innerHTML = `
          <div class="empty-state">
            <span>Nema rezultata za uneti pojam.</span>
            <span>No results for the entered term.</span>
          </div>
        `;
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
