let pokemons = [];

const fetchData = () => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=200&offset=0")
    .then((response) => response.json()) //waiting all data response, makes it into string
    .then((json) => {
      const fetches = json.results.map((item) => {
        return fetch(item.url).then((res) => res.json()); //res =response
      });
      Promise.all(fetches).then((data) => {
        pokemons = data;
        displayData(pokemons); //trigger display
        console.log(pokemons);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
};

fetchData();

const displayData = (data) => {
  //data = currently pokemon array
  const container = document.querySelector(".data"); //where
  container.innerHTML = ""; //cleans everything with empty

  data.forEach((pokemon) => {
    //goes for every pokemom in the array
    const pokemonCard = document.createElement("div"); //makes card
    const imageUrl =
      pokemon.sprites.other.dream_world.front_default ??
      pokemon.sprites.other["official-artwork"].front_default ??
      "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kZW4nlRSLAMq0EA2EoKStg.png";

    const isFavourite = localStorage.getItem(pokemon.name) === "true"; // checks if the pokemon name is in storage
    const favoriteText = isFavourite ? "Unmark favorite" : "Mark favourite"; //toggles the text if the pokemon is in marked

    pokemonCard.innerHTML = `<h2>${pokemon.name}</h2>
    <img src="${imageUrl}"</img>
    <div class="card">
    <p>Weight: ${pokemon.weight / 10}kg</p>
    <p>Height: ${pokemon.height / 10}m</p>
    </div>
    <button id="favButton" data-name=${pokemon.name}> ${favoriteText}</button>`; // created attribute for button
    container.appendChild(pokemonCard); //add to the card
  });
  addFavorites();
};

const toggleFavorite = (e) => {
  const pokemonName = e.target.getAttribute("data-name");
  const isFavourite = localStorage.getItem(pokemonName) === "true";
  localStorage.setItem(pokemonName, !isFavourite);
  displayData(pokemons);
};

const addFavorites = () => {
  document
    .querySelectorAll("#favButton")
    .forEach((button) => button.addEventListener("click", toggleFavorite));
};

const debounce = (func, delay) => {
  let debounceTimer; //stores timeout
  return function () {
    //anynomous function
    const context = this; //this func is the context
    const args = arguments;
    clearTimeout(debounceTimer); //resets the timer
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }; //calls the timer again
};

const searchPokemons = debounce((searchedpoke) => {
  //timeout function included
  //searchedpoke = input value
  const filteredData = pokemons.filter(
    (pokemon) => pokemon.name.toLowerCase().includes(searchedpoke.toLowerCase()) //checks every pokemon card until it finds matching pokemon, letter by letter
  );
  displayData(filteredData);
}, 300); //delay time

document.querySelector("#search").addEventListener("input", (e) => {
  searchPokemons(e.target.value); //what is the current value
});
