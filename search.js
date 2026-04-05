// BUTTON EFFECT
function applyButtonEffects() {
  const buttons = document.querySelectorAll("button");
  
  buttons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      btn.style.background = `radial-gradient(circle at ${x}px ${y}px, #B4FF00 0%, transparent 80%), rgba(0,0,0,1)`;
    });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "none";
    });
  });
}

applyButtonEffects();

// FETCH
async function loadAnimeData(url) {
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

// RESULTS
async function updateResults(animeData, scroll = false) {
  let results = document.getElementById("results");
  results.innerHTML = "";
  
  if (!animeData || animeData.length === 0) {
    results.innerHTML = "<p>No results found</p>";
    return;
  }
  
  animeData.forEach(anime => {
    const title = anime.title_english || anime.title;
    
    let card = document.createElement("div");
    card.classList.add("card");
    
    card.innerHTML = `
      <a href="anime.html?id=${anime.mal_id}">
        <img src="${anime.images.jpg.image_url}">
        <div class="search-info">
          <div class="episodes">EP ${anime.episodes || 'N/A'}</div>
          <h3>${title}</h3>
        </div>
      </a>
    `;
    
    results.appendChild(card);
  });
  
  if (scroll) {
    results.scrollIntoView({ behavior: "smooth" });
  }
}

// INITIAL LOAD + RESTORE SEARCH 🔥
window.addEventListener("load", () => {
  const lastSearch = localStorage.getItem("lastSearch");
  const input = document.getElementById("searchInput");

  if (lastSearch) {
    input.value = lastSearch;
    searchAnime(); // 🔥 restore results
  } else {
    loadInitialAnime();
  }
});

// INITIAL
async function loadInitialAnime() {
  const data = await loadAnimeData('https://api.jikan.moe/v4/top/anime?limit=20');
  updateResults(data);
}

// SEARCH
async function searchAnime() {
  let query = document.getElementById("searchInput").value.trim();
  
  if (!query) {
    localStorage.removeItem("lastSearch");
    return loadInitialAnime();
  }
  
  // 🔥 SAVE SEARCH
  localStorage.setItem("lastSearch", query);
  
  const data = await loadAnimeData(`https://api.jikan.moe/v4/anime?q=${query}`);
  updateResults(data, true);
}

// 🔥 ============================
// 🔥 LIVE SUGGESTIONS
// 🔥 ============================

const input = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

let debounceTimer;
let activeIndex = -1;

input.addEventListener("input", () => {
  const query = input.value.trim();
  
  clearTimeout(debounceTimer);
  
  if (!query) {
    suggestionsBox.style.display = "none";
    localStorage.removeItem("lastSearch"); // 🔥 clear saved
    loadInitialAnime();
    return;
  }
  
  debounceTimer = setTimeout(async () => {
    const data = await loadAnimeData(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`);
    
    suggestionsBox.innerHTML = "";
    
    if (!data || data.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }
    
    data.forEach((anime, index) => {
      const title = anime.title_english || anime.title;
      
      const div = document.createElement("div");
      div.classList.add("suggestion-item");
      div.textContent = title;
      
      // 🔥 CLICK = SEARCH (NO REDIRECT)
      div.addEventListener("click", () => {
        input.value = title;
        localStorage.setItem("lastSearch", title);
        
        suggestionsBox.style.display = "none";
        
        searchAnime(); // 🔥 do search
      });
      
      suggestionsBox.appendChild(div);
    });
    
    suggestionsBox.style.display = "block";
    activeIndex = -1;
    
  }, 300);
});

// KEYBOARD NAVIGATION
input.addEventListener("keydown", (e) => {
  const items = document.querySelectorAll(".suggestion-item");
  
  if (!items.length) return;
  
  if (e.key === "ArrowDown") {
    activeIndex++;
    if (activeIndex >= items.length) activeIndex = 0;
  }
  
  else if (e.key === "ArrowUp") {
    activeIndex--;
    if (activeIndex < 0) activeIndex = items.length - 1;
  }
  
  else if (e.key === "Enter") {
    if (activeIndex >= 0) {
      items[activeIndex].click(); // 🔥 triggers search now
      return;
    }
    searchAnime();
  }
  
  items.forEach(i => i.classList.remove("active"));
  if (items[activeIndex]) items[activeIndex].classList.add("active");
});

// CLICK OUTSIDE CLOSE
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    suggestionsBox.style.display = "none";
  }
});
