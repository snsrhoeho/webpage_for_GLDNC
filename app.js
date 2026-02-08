const decks = Array.isArray(window.PPT_PRODUCTS) ? window.PPT_PRODUCTS : [];
const nav = document.getElementById("deck-nav");
const cards = document.getElementById("cards");
const summary = document.getElementById("deck-summary");
const deckCount = document.getElementById("deck-count");
const slideCount = document.getElementById("slide-count");
const deckFilename = document.getElementById("deck-filename");

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

const fallbackBullets = ["상세 설명은 PPT 원문을 참고하세요."];

const deckStats = decks.reduce(
  (acc, deck) => {
    acc.decks += 1;
    acc.slides += deck.slides.length;
    return acc;
  },
  { decks: 0, slides: 0 }
);

deckCount.textContent = `덱 ${deckStats.decks}개`;
slideCount.textContent = `슬라이드 ${deckStats.slides}개`;

function renderDeck(index) {
  const deck = decks[index];
  if (!deck) return;

  [...nav.children].forEach((btn, idx) => {
    btn.classList.toggle("is-active", idx === index);
  });

  const slideTotal = deck.slides.length;
  summary.innerHTML = `
    <h2>${deck.title}</h2>
    <span>총 ${slideTotal}개 슬라이드 · 제품 카드 ${slideTotal}개</span>
    <span>${deck.filename}</span>
  `;

  deckFilename.textContent = deck.filename;

  cards.innerHTML = "";
  deck.slides.forEach((slide, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.transitionDelay = `${idx * 40}ms`;

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
  });
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
