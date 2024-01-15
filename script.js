let currentPokemon;
let offset = 0;
let limit = 30;

async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    allPokemon = await response.json();
    console.log('loaded Pokemon', allPokemon);

    await renderAllPokemon();
}

async function renderAllPokemon() {
    const allPokemonContainer = document.getElementById('allPokemonContainer');

    for (let i = 0; i < allPokemon.results.length; i++) {
        const pokemonData = await getPokemonDetails(allPokemon.results[i].url);
        const typesDivs = await getPokemonTypes(pokemonData);

        const pokemonCard = pokemonCardTemplate(pokemonData, typesDivs);
        const backgroundColorClass = getBackgroundColorClass(pokemonData.types[0].type.name);
        const coloredPokemonCard = `<div class="pokemonCard ${backgroundColorClass}">${pokemonCard}</div>`;

        allPokemonContainer.innerHTML += coloredPokemonCard;
    }

    allPokemonContainer.innerHTML += '<button id="loadMoreButton" onclick="loadMore()">Load More</button>';
}


function getBackgroundColorClass(type) {
    switch (type) {
        case 'normal':
            return 'normalBackground';
        case 'fighting':
            return 'fightingBackground';
        case 'flying':
            return 'flyingBackground';
        case 'poison':
            return 'poisonBackground';
        case 'ground':
            return 'groundBackground';
        case 'rock':
            return 'rockBackground';
        case 'bug':
            return 'bugBackground';
        case 'ghost':
            return 'ghostBackground';
        case 'steel':
            return 'steelBackground';
        case 'fire':
            return 'fireBackground';
        case 'water':
            return 'waterBackground';
        case 'grass':
            return 'grassBackground';
        case 'electric':
            return 'electricBackground';
        case 'psychic':
            return 'psychicBackground';
        case 'ice':
            return 'iceBackground';
        case 'dragon':
            return 'dragonBackground';
        case 'dark':
            return 'darkBackground';
        case 'fairy':
            return 'fairyBackground';
        default:
            return 'defaultBackground';
    }
}


async function loadMore() {
    const loadMoreButton = document.getElementById('loadMoreButton');
    if (loadMoreButton) {
        loadMoreButton.remove();
    }

    offset += limit;
    await loadPokemon();
}

async function getPokemonDetails(url) {
    let response = await fetch(url);
    return await response.json();
}

async function getPokemonTypes(pokemonData) {
    const types = pokemonData.types;
    let typeDivs = '';

    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        const backgroundColorClass = getBackgroundColorClass(type);
        typeDivs += `<div class="pokemonType ${backgroundColorClass}">${type}</div>`;
    }

    return typeDivs;
}


function pokemonCardTemplate(pokemonData, typeDivs) {
    return `
        <div class="pokemonCard">
            <div class="pokemonName">${pokemonData.name}</div>
            <div class="pokemonTypes">${typeDivs}</div>
            <img class="pokemonImage" src="${pokemonData.sprites.other['official-artwork'].front_default}">
            <div class="pokemonId">${pokemonData.id}</div>
        </div>
    `;
}
