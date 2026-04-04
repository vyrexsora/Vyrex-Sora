// FETCH FUNCTION
async function fetchAnime(url) {
  try {
    let res = await fetch(url);

    if (!res.ok) {
      console.log("API ERROR:", res.status);
      return [];
    }

    let data = await res.json();
    return data.data || [];

  } catch (err) {
    console.log("FETCH FAILED:", err);
    return [];
  }
}

// HERO CAROUSEL
let heroIndex = 0;

async function loadHero() {
  const data = await fetchAnime('https://api.jikan.moe/v4/seasons/now');

  const container = document.getElementById("heroCarousel");

  data.slice(0, 5).forEach((anime, i) => {
    let slide = document.createElement("div");
    slide.classList.add("hero-slide");
    if (i === 0) slide.classList.add("active");
  
    const title = anime.title_english || anime.title;
  
    slide.innerHTML = `
      <a href="anime.html?id=${anime.mal_id}" class="hero-link">
        <img src="${anime.images.jpg.large_image_url}">
        <div class="hero-content">
          <h2>${title}</h2>
          <p>${anime.genres.map(g => g.name).join(", ")}</p>
        </div>
      </a>
    `;
  
    container.appendChild(slide);
  });

  setInterval(() => {
    const slides = document.querySelectorAll(".hero-slide");
    slides[heroIndex].classList.remove("active");
    heroIndex = (heroIndex + 1) % slides.length;
    slides[heroIndex].classList.add("active");
  }, 4000);
}

// LOAD ROWS
async function loadRow(id, url) {
  const data = await fetchAnime(url);
  const container = document.getElementById(id);

  if (!data || data.length === 0) {
    console.log("No data for:", id);
    return;
  }

  data.slice(0, 10).forEach(anime => {
    let card = document.createElement("div");
    card.classList.add("anime-card");
  
    const title = anime.title_english || anime.title;
  
    card.innerHTML = `
      <a href="anime.html?id=${anime.mal_id}">
        <img src="${anime.images?.jpg?.image_url}">
      </a>
    `;
  
    container.appendChild(card);
  });
}

// INIT
async function init() {
  await loadHero();

  await loadRow("topAiring", "https://api.jikan.moe/v4/top/anime?filter=airing");

  await delay(500);
  await loadRow("newEpisodes", "https://api.jikan.moe/v4/seasons/now");

  await delay(500);
  await loadRow("favorites", "https://api.jikan.moe/v4/top/anime?filter=favorite");

  await delay(500);
  await loadRow("topTV", "https://api.jikan.moe/v4/anime?type=tv&order_by=score&sort=desc");

  await delay(500);
  await loadRow("topMovie", "https://api.jikan.moe/v4/top/anime?type=movie");

  await delay(500);
  await loadRow("popular", "https://api.jikan.moe/v4/anime?order_by=members&sort=desc");
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

init();