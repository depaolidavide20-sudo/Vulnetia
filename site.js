(() => {
  const waNumber = "393338426879";
  const labels = {
    it: {
      greeting: "Ciao Vulnetia, vorrei ricevere disponibilita e prezzo per una camera.",
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
  initBookingForms();
  initCarousels();
})();