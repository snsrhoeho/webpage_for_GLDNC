const decks = Array.isArray(window.PPT_PRODUCTS) ? window.PPT_PRODUCTS : [];
const nav = document.getElementById("deck-nav");
const slideNav = document.getElementById("slide-nav");
const cards = document.getElementById("cards");
const summary = document.getElementById("deck-summary");
const pageFade = document.getElementById("page-fade");
const pageFadeLabel = document.getElementById("page-fade-label");
let hasBootFade = false;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

const fallbackBullets = ["PPT 원문을 참고하세요."];

let currentDeckIndex = 0;
let currentSlideIndex = 0;

function updateSummary(deck, slide) {
  const slideTotal = deck.slides.length;
  const slideLabel = slide ? `SLIDE ${slide.slide_number}` : "-";
  summary.innerHTML = `
    <h2>${deck.title}</h2>
    <span>현재 ${slideLabel}</span>
  `;
}

function renderSlide(slideIndex) {
  const deck = decks[currentDeckIndex];
  if (!deck) return;
  const slide = deck.slides[slideIndex];
  if (!slide) return;

  currentSlideIndex = slideIndex;
  [...slideNav.children].forEach((btn, idx) => {
    btn.classList.toggle("is-active", idx === slideIndex);
  });

  updateSummary(deck, slide);

  cards.innerHTML = "";
  const card = document.createElement("a");
  card.className = "card card-link";
  card.href = `slide.html?deck=${currentDeckIndex}&slide=${slideIndex}`;
  card.setAttribute("aria-label", `Open SLIDE ${slide.slide_number} details`);
  card.style.transitionDelay = "0ms";

  const media = document.createElement("div");
  media.className = "card-media";
  if (slide.images && slide.images.length > 0) {
    const img = document.createElement("img");
    img.src = slide.images[0];
    img.alt = slide.title;
    media.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.textContent = "Preview";
    media.appendChild(placeholder);
  }

  const body = document.createElement("div");
  body.className = "card-body";

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.textContent = `SLIDE ${slide.slide_number}`;

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = slide.title;

  const list = document.createElement("ul");
  list.className = "card-list";
  const bullets = slide.bullets && slide.bullets.length ? slide.bullets : fallbackBullets;
  bullets.slice(0, 4).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  body.appendChild(meta);
  body.appendChild(title);
  body.appendChild(list);

  card.appendChild(media);
  card.appendChild(body);
  cards.appendChild(card);
  observer.observe(card);

  card.classList.add("is-highlight");
  setTimeout(() => {
    card.classList.remove("is-highlight");
  }, 900);
}

function renderDeck(index) {
  const deck = decks[index];
  if (!deck) return;

  if (pageFade) {
    pageFade.style.transitionDuration = "0.12s";
    if (pageFadeLabel) {
      pageFadeLabel.textContent = hasBootFade
        ? deck.title || deck.filename || ""
        : "GL D&C";
    }
    pageFade.classList.add("is-active");
    hasBootFade = true;
  }

  currentDeckIndex = index;
  currentSlideIndex = 0;

  [...nav.children].forEach((btn, idx) => {
    btn.classList.toggle("is-active", idx === index);
  });

  slideNav.innerHTML = "";
  deck.slides.forEach((slide, idx) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slide-button";
    button.textContent = `SLIDE ${slide.slide_number}`;
    button.addEventListener("click", () => renderSlide(idx));
    slideNav.appendChild(button);
  });

  renderSlide(currentSlideIndex);

  if (pageFade) {
    setTimeout(() => {
      pageFade.style.transitionDuration = "0.9s";
      pageFade.classList.remove("is-active");
    }, 2000);
  }
}

decks.forEach((deck, idx) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "deck-button";
  button.textContent = deck.title || deck.filename;
  button.addEventListener("click", () => renderDeck(idx));
  nav.appendChild(button);
});

if (decks.length) {
  renderDeck(0);
}

const ceoCard = document.getElementById("ceo-card");

const mapToggle = document.getElementById("map-toggle");
const mapCard = document.getElementById("map-card");

function toggleExclusive(targetCard, otherCard) {
  if (!targetCard) return;
  const willShow = !targetCard.classList.contains("is-visible");
  targetCard.classList.toggle("is-visible", willShow);
  targetCard.setAttribute("aria-hidden", String(!willShow));
  if (otherCard) {
    otherCard.classList.remove("is-visible");
    otherCard.setAttribute("aria-hidden", "true");
  }
}

if (mapToggle && mapCard) {
  mapToggle.addEventListener("click", () => {
    toggleExclusive(mapCard, ceoCard);
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const deck = decks[currentDeckIndex];
  if (!deck) return;
  const nextIndex = currentSlideIndex + direction;
  if (nextIndex < 0 || nextIndex >= deck.slides.length) return;
  renderSlide(nextIndex);
});
