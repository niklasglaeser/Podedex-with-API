let currentPokemon;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/ditto';
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('loaded Pokemon', currentPokemon);

    await renderAllPokemon();
}

async function renderAllPokemon() {
    const allPokemonContainer = document.getElementById('allPokemonContainer');

    const typesDivs = await getPokemonTypes(currentPokemon);

    allPokemonContainer.innerHTML = pokemonCardTemplate(currentPokemon, typesDivs);

    const pokemonContainer = document.getElementById('pokemonContainer');
}

async function getPokemonTypes(currentPokemon) {
    const types = currentPokemon.types;
    let typesDivs = '';

    for (let i = 0; i < types.length; i++) {
        typesDivs += `<div class="pokemonType">${types[i].type.name}</div>`;
    }

    return typesDivs;
}

function pokemonCardTemplate(currentPokemon, typesDivs) {
    return `
        <div id="pokemonContainer">
            <div id="pokemonName"> ${currentPokemon['name']} </div>
            <div id="pokemonTypes">${typesDivs}</div>
            <img class="pokemonImage" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}">
            <div> ${currentPokemon['id']}</div>
        </div>
    `;
}
