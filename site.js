(() => {
  const labels = {
    it: {
      roomGreeting: "Ciao Vulnetia, vorrei ricevere disponibilità e prezzo per una camera.",
      restaurantGreeting: "Ciao Vulnetia, vorrei prenotare un tavolo al ristorante.",
      room: "Soluzione",
      recommendedRoom: "Soluzione: da consigliare in base a ospiti e durata",
      checkin: "Check-in",
      checkout: "Check-out",
      date: "Data",
      time: "Orario",
      guests: "Ospiti",
      people: "Persone",
      name: "Nome",
      phone: "Telefono",
      notes: "Note"
    },
    en: {
      roomGreeting: "Hello Vulnetia, I would like to receive availability and price for a room.",
      restaurantGreeting: "Hello Vulnetia, I would like to book a table at the restaurant.",
      room: "Room",
      recommendedRoom: "Option: please recommend based on guests and length of stay",
      checkin: "Check-in",
      checkout: "Check-out",
      date: "Date",
      time: "Time",
      guests: "Guests",
      people: "People",
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
    const mainLabel = cta?.querySelector("[data-mobile-cta-main-label]");
    const mainIcon = cta?.querySelector("[data-mobile-cta-main-icon]");
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

      if (mainLabel) {
        mainLabel.textContent = read(mode + "-label", mainLabel.textContent.trim());
      } else {
        main.textContent = read(mode + "-label", main.textContent.trim());
      }
      mainIcon?.classList.toggle("is-hidden", mode === "hero");
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

  function fieldValue(form, name) {
    const field = form.elements.namedItem(name);
    if (!field) return "";
    if ("value" in field) return String(field.value || "").trim();
    return "";
  }

  function pageRoomName() {
    const heading = document.querySelector(".unit-hero-copy h1, .collection-intro h1, h1");
    return heading ? heading.textContent.trim().replace(/\s+/g, " ") : "";
  }

  function initBookingForms() {
    document.querySelectorAll(".booking-form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const lang = currentLang();
        const t = labels[lang];
        const type = form.getAttribute("data-booking-form") || "rooms";
        const number = form.getAttribute("data-wa-number") || (type === "restaurant" ? "393495591277" : "393338426879");
        const name = fieldValue(form, "name");
        const phone = fieldValue(form, "phone");
        const notes = fieldValue(form, "notes");
        const room = form.getAttribute("data-default-room") || pageRoomName();
        let message;

        if (type === "restaurant") {
          message = [
            t.restaurantGreeting,
            name ? t.name + ": " + name : "",
            phone ? t.phone + ": " + phone : "",
            fieldValue(form, "date") ? t.date + ": " + fieldValue(form, "date") : "",
            fieldValue(form, "time") ? t.time + ": " + fieldValue(form, "time") : "",
            fieldValue(form, "people") ? t.people + ": " + fieldValue(form, "people") : "",
            notes ? t.notes + ": " + notes : ""
          ];
        } else {
          message = [
            t.roomGreeting,
            name ? t.name + ": " + name : "",
            phone ? t.phone + ": " + phone : "",
            fieldValue(form, "checkin") ? t.checkin + ": " + fieldValue(form, "checkin") : "",
            fieldValue(form, "checkout") ? t.checkout + ": " + fieldValue(form, "checkout") : "",
            fieldValue(form, "guests") ? t.guests + ": " + fieldValue(form, "guests") : "",
            room ? t.room + ": " + room : t.recommendedRoom,
            notes ? t.notes + ": " + notes : ""
          ];
        }

        window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message.filter(Boolean).join("\n")), "_blank", "noopener");
        form.reset();
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