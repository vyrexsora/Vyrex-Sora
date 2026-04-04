// BUTTON HOVER EFFECT FUNCTION
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

// RUN ON LOAD
applyButtonEffects();

// SEARCH ANIME (JIKAN API) - SMOOTH VERSION
async function loadAnimeData(url) {
  try {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error("<p>Failed to fetch data</p>");
    }

    let data = await res.json();
    return data.data;

  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML = "<p>Error loading data. Try again.</p>";
    return [];
  }
}

async function updateResults(animeData, scrollToResults = false) {
  let results = document.getElementById("results");
  
  // Fade out effect
  results.classList.add('fade-out');
  
  setTimeout(() => {
    results.innerHTML = "";
    
    if (!animeData || animeData.length === 0) {
      results.innerHTML = "<p>No results found</p>";
      results.classList.remove('fade-out');
      return;
    }

    animeData.forEach((anime, index) => {
      let card = document.createElement("div");
      card.classList.add("card");
      card.style.animationDelay = `${index * 0.06}s`;
      
      const englishTitle = anime.title_english || anime.title;
      
      card.innerHTML = `
        <a href="anime.html?id=${anime.mal_id}">
          <img src="${anime.images.jpg.image_url}">
          <div class="search-info">
            <div class="episodes">EP ${anime.episodes || 'N/A'}</div>
            <h3>${englishTitle}</h3>
          </div>
        </a>
      `;
      
      results.appendChild(card);
    });
    
    results.classList.remove('fade-out');
    results.classList.add('fade-in');
    applyButtonEffects();
    
    if (scrollToResults) {
      setTimeout(() => {
        results.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 50);
    }
  }, 50);
}

async function loadInitialAnime() {
  let results = document.getElementById("results");
  
  // LOADING STATE
  results.innerHTML = "<p>Loading...</p>";

  const animeData = await loadAnimeData('https://api.jikan.moe/v4/top/anime?limit=20');
  updateResults(animeData, false);
}

async function searchAnime() {
  let query = document.getElementById("searchInput").value.trim();
  let results = document.getElementById("results");

  // LOADING STATE
  results.innerHTML = "<p>Searching...</p>";
  
  if (!query) {
    loadInitialAnime();
    return;
  }
  
  const animeData = await loadAnimeData(`https://api.jikan.moe/v4/anime?q=${query}`);
  updateResults(animeData, true);
}

// CLEAR INPUT DETECTION
document.getElementById("searchInput").addEventListener('input', function(e) {
  if (e.target.value.trim() === '') {
    loadInitialAnime();
  }
});

// SEARCH BUTTON
document.querySelector('.search-btn')?.addEventListener('click', searchAnime);

// ENTER KEY SUPPORT
document.getElementById("searchInput").addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchAnime();
  }
});

// Load 20 top anime on page load
loadInitialAnime();