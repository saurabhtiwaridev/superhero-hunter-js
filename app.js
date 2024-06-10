document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const resultsDiv = document.getElementById("results");
  const favoritesListDiv = document.getElementById("favorites-list");

  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const query = searchBar.value;
      fetchSuperheroes(query);
    });
  }

  if (favoritesListDiv) {
    displayFavorites();
  }

  async function fetchSuperheroes(query) {
    const ts = Date.now();
    const publicKey = "cc2c4f3bc7ecb9bab91bf65187ca32ce";
    const privateKey = "be72877495fb538d5a8cd9974610d2620d790dff";
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    try {
      const response = await fetch(
        `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
      );
      const data = await response.json();
      displaySuperheroes(data.data.results);
    } catch (error) {
      console.error("Error fetching superheroes:", error);
    }
  }

  function displaySuperheroes(superheroes) {
    resultsDiv.innerHTML = "";
    superheroes.forEach((hero) => {
      const heroDiv = document.createElement("div");
      heroDiv.innerHTML = `
                <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
                <h2>${hero.name}</h2>
                <button onclick="addToFavorites('${hero.id}', '${hero.name}', '${hero.thumbnail.path}.${hero.thumbnail.extension}')">Add to Favorites</button>
                <a href="superhero.html?id=${hero.id}">More Info</a>
            `;
      resultsDiv.appendChild(heroDiv);
    });
  }

  function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesListDiv.innerHTML = "";
    favorites.forEach((hero) => {
      const heroDiv = document.createElement("div");
      heroDiv.innerHTML = `
                <img src="${hero.thumbnail}" alt="${hero.name}">
                <h2>${hero.name}</h2>
                <button onclick="removeFromFavorites('${hero.id}')">Remove from Favorites</button>
            `;
      favoritesListDiv.appendChild(heroDiv);
    });
  }

  window.addToFavorites = function (id, name, thumbnail) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some((hero) => hero.id === id)) {
      favorites.push({ id, name, thumbnail });
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  };

  window.removeFromFavorites = function (id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((hero) => hero.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  };
});

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    await fetchSuperheroDetails(id);
  }

  async function fetchSuperheroDetails(id) {
    const ts = Date.now();
    const publicKey = "cc2c4f3bc7ecb9bab91bf65187ca32ce";
    const privateKey = "be72877495fb538d5a8cd9974610d2620d790dff";
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    try {
      const response = await fetch(
        `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
      );
      const data = await response.json();
      displaySuperheroDetails(data.data.results[0]);
    } catch (error) {
      console.error("Error fetching superhero details:", error);
    }
  }

  function displaySuperheroDetails(hero) {
    const detailsDiv = document.getElementById("superhero-details");
    detailsDiv.innerHTML = `
              <img src="${hero.thumbnail.path}.${
      hero.thumbnail.extension
    }" alt="${hero.name}">
              <h2>${hero.name}</h2>
              <p>${hero.description}</p>
              <h3>Comics</h3>
              <ul>${hero.comics.items
                .map((item) => `<li>${item.name}</li>`)
                .join("")}</ul>
              <h3>Series</h3>
              <ul>${hero.series.items
                .map((item) => `<li>${item.name}</li>`)
                .join("")}</ul>
              <h3>Stories</h3>
              <ul>${hero.stories.items
                .map((item) => `<li>${item.name}</li>`)
                .join("")}</ul>
          `;
  }
});
