// ===============================
// Mukoti Website - script.js
// EmailJS real email + WhatsApp prefill + Gallery
// + Reveal on scroll + cursor glow
// + Logos marquee (Trusted by)
// ===============================

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("show-nav");
  });

  document.querySelectorAll("#nav a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("show-nav"));
  });
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Company contact
const COMPANY_EMAIL = "info@mukoticleaning.co.za";
const WHATSAPP_NUMBER_INTL = "27681087266";

// ✅ EmailJS settings
const EMAILJS_PUBLIC_KEY = "Cu2KbItv5gXgvwhuE";
const EMAILJS_SERVICE_ID = "service_12g1eac";
const EMAILJS_TEMPLATE_ID = "template_qkdd9y9";

// Elements
const quoteForm = document.getElementById("quoteForm");
const note = document.getElementById("formNote");
const whatsappQuoteBtn = document.getElementById("whatsappQuoteBtn");

// -------------------------------
// Helpers
// -------------------------------
function getFormData() {
  return {
    name: document.getElementById("name")?.value.trim() || "",
    email: document.getElementById("email")?.value.trim() || "",
    phone: document.getElementById("phone")?.value.trim() || "",
    service: document.getElementById("service")?.value.trim() || "",
    location: document.getElementById("location")?.value.trim() || "",
    message: document.getElementById("message")?.value.trim() || ""
  };
}

function buildQuoteText(data) {
  return (
`Hello Mukoti Cleaning Services,

I would like to request a quote.

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}
Location: ${data.location}

Details:
${data.message}

Thank you.`
  );
}

function buildWhatsAppLink(text) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${encoded}`;
}

function validate(data) {
  return !!(data.name && data.email && data.phone && data.service && data.location && data.message);
}

// -------------------------------
// WhatsApp (prefilled)
// -------------------------------
function refreshWhatsAppBtn() {
  if (!whatsappQuoteBtn) return;
  const data = getFormData();

  const text = (data.name || data.email || data.phone || data.service || data.location || data.message)
    ? buildQuoteText({
        name: data.name || "[Your Name]",
        email: data.email || "[Your Email]",
        phone: data.phone || "[Your Phone]",
        service: data.service || "[Service]",
        location: data.location || "[Location]",
        message: data.message || "[Details]"
      })
    : "Hello Mukoti Cleaning Services, I would like to request a quote.";

  whatsappQuoteBtn.href = buildWhatsAppLink(text);
}

["name", "email", "phone", "service", "location", "message"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", refreshWhatsAppBtn);
    el.addEventListener("change", refreshWhatsAppBtn);
  }
});

refreshWhatsAppBtn();

// -------------------------------
// EmailJS real sending
// -------------------------------
function initEmailJS() {
  if (!window.emailjs) return;
  if (EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.includes("PASTE_")) {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
}
initEmailJS();

async function sendEmailViaEmailJS(data) {
  if (!window.emailjs) throw new Error("EmailJS not loaded.");
  if (
    !EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.includes("PASTE_") ||
    !EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.includes("PASTE_") ||
    !EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID.includes("PASTE_")
  ) {
    throw new Error("EmailJS keys not set in script.js");
  }

  const params = {
    to_email: COMPANY_EMAIL,
    from_name: data.name,
    from_email: data.email,
    phone: data.phone,
    service: data.service,
    location: data.location,
    details: data.message
  };

  return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
}

if (quoteForm) {
  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = getFormData();

    if (!validate(data)) {
      if (note) note.textContent = "Please complete all fields, then try again.";
      return;
    }

    if (note) note.textContent = "Sending your quote request…";

    try {
      await sendEmailViaEmailJS(data);
      if (note) note.textContent = "✅ Sent! We’ll get back to you shortly.";
      quoteForm.reset();
      refreshWhatsAppBtn();
    } catch (err) {
      console.error(err);
      if (note) note.textContent =
        "Email could not send automatically. Please use WhatsApp instead.";
    }
  });
}

// ===============================
// IMAGE LOADER (spaces + extension fallback)
// ===============================
const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

function fileUrl(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function setImgWithFallback(imgEl, baseName, folder = "img") {
  let idx = 0;

  const tryNext = () => {
    if (idx >= EXTENSIONS.length) return;
    const candidate = `${folder}/${baseName}${EXTENSIONS[idx]}`;
    imgEl.src = fileUrl(candidate);
    idx += 1;
  };

  imgEl.onerror = tryNext;
  tryNext();
}

function setCssBgWithFallback(el, baseName, folder = "img", cssVar = "--hero-img") {
  let idx = 0;

  const tryNext = () => {
    if (idx >= EXTENSIONS.length) return;
    const candidate = `${folder}/${baseName}${EXTENSIONS[idx]}`;
    const url = `url("${fileUrl(candidate)}")`;

    const testImg = new Image();
    testImg.onload = () => el.style.setProperty(cssVar, url);
    testImg.onerror = () => { idx += 1; tryNext(); };
    testImg.src = fileUrl(candidate);
  };

  tryNext();
}

// Header logo
const siteLogo = document.getElementById("siteLogo");
if (siteLogo) setImgWithFallback(siteLogo, "horizontal logo", "img");

// Hero card logo (same file)
const heroLogo = document.getElementById("heroLogo");
if (heroLogo) setImgWithFallback(heroLogo, "horizontal logo", "img");

// Hero background image
const heroSection = document.querySelector(".hero");
if (heroSection) setCssBgWithFallback(heroSection, "hero image", "img", "--hero-img");

// ===============================
// ✅ TRUSTED BY LOGOS MARQUEE
// ===============================
const clientMarquee = document.getElementById("clientMarquee");

const CLIENT_LOGOS = [
  { name: "Avis-Logo", alt: "Avis" },
  { name: "Anthony Norman & Associates Logo", alt: "Anthony Norman & Associates" },
  { name: "Motheo construction group logo", alt: "Motheo Construction Group" }
];

function renderClientLogosMarquee() {
  if (!clientMarquee) return;

  // Build one set of logos
  const buildSet = () => {
    const frag = document.createDocumentFragment();

    CLIENT_LOGOS.forEach(item => {
      const img = document.createElement("img");
      img.className = "client-logo interactive";
      img.alt = item.alt;
      img.loading = "lazy";
      setImgWithFallback(img, item.name, "img");
      frag.appendChild(img);
    });

    return frag;
  };

  // Clear
  clientMarquee.innerHTML = "";

  // Duplicate sets for seamless loop (needed for -50% animation)
  clientMarquee.appendChild(buildSet());
  clientMarquee.appendChild(buildSet());

  // If you have only 3 logos, repeating them more makes the strip feel fuller
  clientMarquee.appendChild(buildSet());
  clientMarquee.appendChild(buildSet());
}

renderClientLogosMarquee();

// ===============================
// REVEAL ON SCROLL
// ===============================
(function initRevealOnScroll(){
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

// ===============================
// HERO CURSOR GLOW (subtle)
// ===============================
(function initHeroGlow(){
  const hero = document.querySelector(".hero");
  const glow = document.querySelector(".hero-glow");
  if (!hero || !glow) return;

  const move = (e) => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  };

  hero.addEventListener("mousemove", move);
})();

// ===============================
// GALLERY
// ===============================
const galleryEl = document.getElementById("realGallery");
const filtersEl = document.getElementById("galleryFilters");

const GALLERY_IMAGES = [
  { name: "carpet", tag: "Carpet" },
  { name: "rug 1", tag: "Rug" },
  { name: "sofa 1", tag: "Upholstery" },
  { name: "sofa 2", tag: "Upholstery" },

  { name: "Couch Cleaning", tag: "Couch Cleaning" },
  { name: "Couch Cleaning 2", tag: "Couch Cleaning" },
  { name: "Couch Cleaning 3", tag: "Couch Cleaning" },
  { name: "Couch Cleaning 4", tag: "Couch Cleaning" },

  { name: "House Cleaning", tag: "House Cleaning" },
  { name: "House Cleaning 1", tag: "House Cleaning" },

  { name: "Mattress Cleaning", tag: "Mattress Cleaning" },
  { name: "Mattress Cleaning 2", tag: "Mattress Cleaning" },
  { name: "Mattress Cleaning 3", tag: "Mattress Cleaning" },

  { name: "Ndlala Mall Cleaning 1", tag: "Commercial" },
  { name: "Ndlala Mall Cleaning 2", tag: "Commercial" },
  { name: "Ndlala Mall Cleaning 3", tag: "Commercial" },

  { name: "Warehouse Cleaning", tag: "Commercial" },
  { name: "Warehouse Cleaning 2", tag: "Commercial" },
  { name: "Warehouse Cleaning 3", tag: "Commercial" },

  { name: "Window Cleaning 1", tag: "Window Cleaning" }
];

let activeTag = "All";

function uniqueTags() {
  const tags = new Set(GALLERY_IMAGES.map(x => x.tag || "Other"));
  return Array.from(tags).sort();
}

function renderGalleryFilters() {
  if (!filtersEl) return;

  const tags = ["All", ...uniqueTags()];
  filtersEl.innerHTML = "";

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn" + (tag === activeTag ? " active" : "");
    btn.textContent = tag;

    btn.addEventListener("click", () => {
      activeTag = tag;
      renderGalleryFilters();
      renderGalleryGrid();
    });

    filtersEl.appendChild(btn);
  });
}

function renderGalleryGrid() {
  if (!galleryEl) return;

  const items = (activeTag === "All")
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(x => (x.tag || "Other") === activeTag);

  galleryEl.innerHTML = "";

  items.forEach(item => {
    const tile = document.createElement("div");
    tile.className = "gallery-tile reveal interactive";

    const img = document.createElement("img");
    img.className = "gallery-photo";
    img.loading = "lazy";
    img.alt = `Mukoti Cleaning Services - ${item.tag || "Work"} (${item.name})`;

    setImgWithFallback(img, item.name, "img");

    const meta = document.createElement("div");
    meta.className = "gallery-meta";

    const tag = document.createElement("span");
    tag.className = "gallery-tag";
    tag.textContent = item.tag || "Other";

    const label = document.createElement("span");
    label.className = "gallery-label";
    label.textContent = item.name;

    meta.appendChild(tag);
    meta.appendChild(label);

    tile.appendChild(img);
    tile.appendChild(meta);

    galleryEl.appendChild(tile);
  });

  // Re-observe newly created reveal tiles
  const newTiles = Array.from(galleryEl.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && newTiles.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    newTiles.forEach(el => io.observe(el));
  } else {
    newTiles.forEach(el => el.classList.add("is-visible"));
  }
}

renderGalleryFilters();
renderGalleryGrid();
