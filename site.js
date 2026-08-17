(() => {
  const waNumber = "393338426879";
  const labels = {
    it: {
      greeting: "Ciao Vulnetia, vorrei ricevere disponibilità e prezzo per una camera.",
      room: "Soluzione",
      dates: "Date",
      guests: "Ospiti",
      name: "Nome",
      phone: "Telefono",
      notes: "Note"
    },
    en: {
      greeting: "Hello Vulnetia, I would like to receive availability and price for a room.",
      room: "Room",
      dates: "Dates",
      guests: "Guests",
      name: "Name",
      phone: "Phone",
      notes: "Notes"
    }
  };

  const currentLang = () => document.documentElement.lang === "en" ? "en" : "it";

  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMobileMenu() {
    const header = document.querySelector(".site-header");
    const menu = document.querySelector("[data-mobile-menu]");
    const button = document.querySelector("[data-mobile-menu-button]");
    if (!header || !menu || !button) return;

    const close = () => {
      menu.classList.remove("is-open");
      header.classList.remove("is-menu-open");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", () => {
      const nextOpen = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", nextOpen);
      header.classList.toggle("is-menu-open", nextOpen);
      button.setAttribute("aria-expanded", String(nextOpen));
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  }

  function initMobileCta() {
    const cta = document.querySelector("[data-mobile-cta]");
    const main = cta?.querySelector("[data-mobile-cta-main]");
    const call = cta?.querySelector("[data-mobile-cta-call]");
    if (!cta || !main || !call) return;

    const sections = ["top", "camere", "ristorante", "recensioni", "contatti"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const read = (key, fallback = "") => cta.getAttribute("data-" + key) || fallback;

    const applyMode = (mode) => {
      cta.classList.remove("mobile-cta-hero", "mobile-cta-rooms", "mobile-cta-restaurant", "has-call");
      cta.classList.add("mobile-cta-" + mode);
      if (mode !== "hero") cta.classList.add("has-call");

      main.textContent = read(mode + "-label", main.textContent.trim());
      main.setAttribute("href", read(mode + "-href", "#camere"));

      if (mode === "rooms") {
        call.setAttribute("href", read("rooms-call", "tel:+393338426879"));
        call.setAttribute("aria-label", read("rooms-call-label"));
      } else if (mode === "restaurant") {
        call.setAttribute("href", read("restaurant-call", "tel:+390187821193"));
        call.setAttribute("aria-label", read("restaurant-call-label"));
      }
    };

    const update = () => {
      const trigger = window.innerHeight * 0.52;
      let activeId = "top";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= trigger && rect.bottom > 120) {
          activeId = section.id;
        }
      });

      if (activeId === "camere") {
        applyMode("rooms");
      } else if (["ristorante", "recensioni", "contatti"].includes(activeId)) {
        applyMode("restaurant");
      } else {
        applyMode("hero");
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function textFrom(labelText) {
    const label = Array.from(document.querySelectorAll("label")).find((item) =>
      item.textContent.trim().toLowerCase().includes(labelText.toLowerCase()),
    );
    if (!label) return "";
    const input = label.querySelector("input, textarea, select");
    return input ? input.value.trim() : "";
  }

  function pageRoomName() {
    const heading = document.querySelector(".unit-hero-copy h1, .collection-intro h1, h1");
    return heading ? heading.textContent.trim().replace(/\s+/g, " ") : "";
  }

  function initBookingForms() {
    document.querySelectorAll(".booking-form").forEach((form) => {
      const action = form.getAttribute("action") || "";
      if (action.startsWith("tel:")) return;

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const lang = currentLang();
        const t = labels[lang];
        const name = textFrom(lang === "en" ? "full name" : "nome e cognome") || textFrom("nome");
        const phone = textFrom(lang === "en" ? "phone" : "telefono");
        const guests = textFrom(lang === "en" ? "guests" : "ospiti");
        const notes = textFrom(lang === "en" ? "notes" : "note");
        const room = pageRoomName();
        const message = [
          t.greeting,
          room ? t.room + ": " + room : "",
          guests ? t.guests + ": " + guests : "",
          name ? t.name + ": " + name : "",
          phone ? t.phone + ": " + phone : "",
          notes ? t.notes + ": " + notes : ""
        ].filter(Boolean).join("\n");

        window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      });
    });
  }

  function initCarousels() {
    document.querySelectorAll(".unit-carousel-shell").forEach((shell) => {
      const viewport = shell.querySelector(".unit-carousel-viewport");
      const previous = shell.querySelector(".unit-carousel-button:not(.unit-carousel-button-next)");
      const next = shell.querySelector(".unit-carousel-button-next");
      if (!viewport) return;

      const step = () => Math.max(320, viewport.clientWidth * 0.82);
      previous?.addEventListener("click", () => viewport.scrollBy({ left: -step(), behavior: "smooth" }));
      next?.addEventListener("click", () => viewport.scrollBy({ left: step(), behavior: "smooth" }));
    });
  }

  initHeader();
  initMobileMenu();
  initMobileCta();
  initBookingForms();
  initCarousels();
})();