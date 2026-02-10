const decks = Array.isArray(window.PPT_PRODUCTS) ? window.PPT_PRODUCTS : [];
const summary = document.getElementById("deck-summary");
const cards = document.getElementById("cards");

const fallbackBullets = ["PPT 원문을 참고하세요."];

const params = new URLSearchParams(window.location.search);
const deckIndex = Number.parseInt(params.get("deck"), 10);
const slideIndex = Number.parseInt(params.get("slide"), 10);

const deck = Number.isInteger(deckIndex) ? decks[deckIndex] : null;
const slide = deck && Number.isInteger(slideIndex) ? deck.slides[slideIndex] : null;

if (!deck || !slide) {
  summary.innerHTML = `
    <h2>슬라이드를 찾을 수 없습니다</h2>
    <span>목록으로 돌아가 다시 선택해 주세요.</span>
  `;
} else {
  summary.innerHTML = `
    <h2>${deck.title}</h2>
    <span>SLIDE ${slide.slide_number}</span>
  `;

  const card = document.createElement("article");
  card.className = "card is-visible";

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
}

if (deck && slide) {
  window.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = slideIndex + direction;
    if (nextIndex < 0 || nextIndex >= deck.slides.length) return;
    window.location.href = `slide.html?deck=${deckIndex}&slide=${nextIndex}`;
  });
}
