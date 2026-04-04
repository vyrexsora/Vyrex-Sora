// GET ID FROM URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.getElementById("animeTitle").textContent = "No anime selected.";
  throw new Error("Anime ID missing in URL");
}

// GLOBAL CACHE (🔥 avoids refetching)
let currentAnime = null;

// FETCH ANIME DATA
async function loadAnime() {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await res.json();

    const anime = data.data;
    currentAnime = anime; // 🔥 store globally

    // 🔥 FORCE ENGLISH
    const title = anime.title_english || anime.title || "Unknown Title";
    const synopsis = anime.synopsis || "No description available.";
    const rating = anime.score ? anime.score.toFixed(1) : "N/A";

    // HERO
    const hero = document.getElementById("animeHero");
    hero.style.backgroundImage = `url(${anime.images.jpg.large_image_url})`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";

    // TEXT
    document.getElementById("animeTitle").textContent = title;

    document.getElementById("animeGenres").textContent =
      anime.genres?.map(g => g.name).join(", ") || "Unknown";

    document.getElementById("animeSynopsis").textContent = synopsis;

    // ⭐ RATING (clean format)
    document.querySelector(".rating").textContent = `⭐ ${rating} / 10`;

    // 🔥 EXPANDED SUMMARY
    document.getElementById("animeSummary").textContent =
      synopsis + "\n\n" +
      "The story unfolds through multiple arcs, focusing on character growth, emotional depth, and evolving relationships. " +
      "Each episode builds upon the previous, gradually revealing motivations, conflicts, and hidden layers within the narrative. " +
      "Themes such as perseverance, identity, and personal struggle are explored, making the experience immersive and impactful. " +
      "As the plot progresses, tension rises and stakes become higher, leading to powerful moments and memorable developments.";

  } catch (err) {
    console.error("Error loading anime:", err);
    document.getElementById("animeTitle").textContent = "Failed to load anime.";
  }
}

// FETCH CHARACTERS
async function loadCharacters() {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
    const data = await res.json();

    const container = document.getElementById("animeCharacters");
    container.innerHTML = "";

    data.data.slice(0, 10).forEach(c => {
      const div = document.createElement("div");
      div.classList.add("character");

      div.innerHTML = `
        <img src="${c.character.images.jpg.image_url}">
        <p>${c.character.name}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading characters:", err);
  }
}

// ADD TO LIST
document.getElementById("addToList").addEventListener("click", () => {
  try {
    if (!currentAnime) return;

    const title = currentAnime.title_english || currentAnime.title;

    let list = JSON.parse(localStorage.getItem("animeList")) || [];

    // ❌ avoid duplicates
    if (list.find(a => a.mal_id === currentAnime.mal_id)) {
      alert("Already in list!");
      return;
    }

    // 🔥 SAVE EPISODES ALSO (fix your list bug)
    list.push({
      mal_id: currentAnime.mal_id,
      title: title,
      image: currentAnime.images.jpg.image_url,
      episodes: currentAnime.episodes || null
    });

    localStorage.setItem("animeList", JSON.stringify(list));

    // ✅ better UX than alert
    document.getElementById("addToList").style.transform = "scale(1.2)";
    setTimeout(() => {
      document.getElementById("addToList").style.transform = "scale(1)";
    }, 200);

  } catch (err) {
    console.error("Error adding to list:", err);
  }
});

// INIT
loadAnime();
loadCharacters();