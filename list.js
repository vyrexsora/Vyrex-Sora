const container = document.getElementById("animeListContainer");

// LOAD LIST
async function loadList() {
  let list = JSON.parse(localStorage.getItem("animeList")) || [];
  
  container.innerHTML = "";
  
  if (list.length === 0) {
    container.innerHTML = `<p class="empty-msg">Your list is empty.</p>`;
    return;
  }
  
  for (let anime of list) {
    if (!anime.epText) {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
        const data = await res.json();
        const a = data.data;
        
        const total = a.episodes;
        const status = a.status;
        
        let epText = "N/A";
        
        if (status === "Not yet aired") {
          // ❌ Future anime
          epText = "N/A";
        }
        else if (total && total > 0) {
          // ✅ If Jikan provides episode count (finished or ongoing)
          epText = `${total}`;
        }
        else {
          // ❌ Unknown
          epText = "N/A";
        }
        
        anime.episodes = total || "N/A";
        anime.epText = epText;
        
      } catch {
        anime.epText = "N/A";
      }
    }
    
    const card = document.createElement("div");
    card.classList.add("list-card");
    
    card.innerHTML = `
    <button class="remove-btn" data-id="${anime.mal_id}">✕</button>

    <a href="anime.html?id=${anime.mal_id}">
      <img src="${anime.image}">
      <div class="list-info">
        <p>EP ${anime.epText}</p>
        <h3>${anime.title}</h3>
      </div>
    </a>
  `;
    
    container.appendChild(card);
  }
  
  // 🔥 SAVE UPDATED LIST (with episodes)
  localStorage.setItem("animeList", JSON.stringify(list));
  
  // REMOVE HANDLER
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const card = btn.closest(".list-card");
      
      // 🔥 REMOVE ANIMATION
      card.style.transform = "scale(0.8)";
      card.style.opacity = "0";
      
      setTimeout(() => {
        const id = btn.getAttribute("data-id");
        removeAnime(id);
      }, 300);
    });
  });
}

// REMOVE FUNCTION
function removeAnime(id) {
  let list = JSON.parse(localStorage.getItem("animeList")) || [];
  
  list = list.filter(anime => anime.mal_id != id);
  
  localStorage.setItem("animeList", JSON.stringify(list));
  
  loadList();
}

// INIT
loadList();