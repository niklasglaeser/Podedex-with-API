
let allPokemon;
let offset = 0;
let limit = 30;

async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    allPokemon = await response.json();

    await renderAllPokemon();
}

async function renderAllPokemon() {
    const allPokemonContainer = document.getElementById('allPokemonContainer');
    const loadMoreButtonContainer = document.getElementById('loadMoreButtonContainer');

    for (let i = 0; i < allPokemon.results.length; i++) {
        const pokemonData = await getPokemonDetails(allPokemon.results[i].url);
        const typesDivs = await getPokemonTypes(pokemonData);
        types = pokemonData.types;
        const type = types[0].type.name;

        const pokemonCard = pokemonCardTemplate(pokemonData, typesDivs);
        const coloredPokemonCard = `<div onClick="openBigCard(${pokemonData.id})" class="pokemonCard ${type}Background">${pokemonCard}</div>`;

        allPokemonContainer.innerHTML += coloredPokemonCard;
    }

    loadMoreButtonContainer.innerHTML += '<button id="loadMoreButton" onClick="loadMore()">Load More</button>';
}

async function loadMore() {
    const loadMoreButton = document.getElementById('loadMoreButton');
    if (loadMoreButton) {
        loadMoreButton.remove();
    }

    offset += 30;
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
        typeDivs += `<div class="pokemonType ${type}Background">${type}</div>`;
    }

    return typeDivs;
}

async function openBigCard(pokemonId) {
    const pokemonData = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const typesDivs = await getPokemonTypes(pokemonData);

    renderBigCard(pokemonData, typesDivs);

    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const bigCardContainer = document.getElementById('bigCardContainer');
    bigCardContainer.style.top = `${scrollY}px`;

    document.body.classList.add('no-scroll');  // Disable scrolling
    document.getElementById('allPokemonContainer').classList.add('blur');
    bigCardContainer.style.display = 'flex';
}


function closeBigCard() {
    document.body.classList.remove('no-scroll');
    document.getElementById('allPokemonContainer').classList.remove('blur');

    const bigCardContainer = document.getElementById('bigCardContainer');
    bigCardContainer.style.display = 'none';

    // Reset the top position
    bigCardContainer.style.top = '0';
}


async function renderBigCard(pokemonData, typesDivs) {
    const bigCardContainer = document.getElementById('bigCardContainer');
    bigCardContainer.innerHTML = pokemonCardTemplateBig(pokemonData, typesDivs);
}

function pokemonCardTemplate(pokemonData, typeDivs) {
    const pokemonNameCaps = pokemonData.name.toUpperCase();

    return `
        <div class="pokemonCard" data-id="${pokemonData.id}">
            <div class="pokemonName">${pokemonNameCaps}</div>
            <div class="pokemonTypes">${typeDivs}</div>
            <img class="pokemonImage" src="${pokemonData.sprites.other['official-artwork'].front_default}">
            <div class="pokemonId">${pokemonData.id}</div>
        </div>
    `;
}

function pokemonCardTemplateBig(pokemonData, typesDivs) {
    const pokemonNameCaps = pokemonData.name.toUpperCase();
    const type = pokemonData.types[0].type.name;

    return `
        <div class="pokemonCardBig ${type}Background">
            <div class="pokemonNameBig">${pokemonNameCaps}</div>
            <div class="pokemonTypesBig">${typesDivs}</div>
            <img class="pokemonImageBig" src="${pokemonData.sprites.other['official-artwork'].front_default}">
            <div class="pokemonIdBig">${pokemonData.id}</div>
            <button onClick="showPreviousPokemon(${pokemonData.id})">Previous</button>
            <button onClick="showNextPokemon(${pokemonData.id})">Next</button>
            <button onClick="closeBigCard()">Close</button>
        </div>
    `;
}




async function showPreviousPokemon(currentPokemonId) {
    const totalPokemonCount = allPokemon.count - 290;

    let previousPokemonId;

    if (currentPokemonId - 1 <= 0) {
        previousPokemonId = totalPokemonCount;
    } else {
        previousPokemonId = currentPokemonId - 1;
    }

    await updateBigCard(previousPokemonId);
}

async function showNextPokemon(currentPokemonId) {
    const totalPokemonCount = allPokemon.count - 290;
    let nextPokemonId;

    if (currentPokemonId + 1 > totalPokemonCount) {
        nextPokemonId = 1;
    } else {
        nextPokemonId = currentPokemonId + 1;
    }

    await updateBigCard(nextPokemonId);
}


async function updateBigCard(pokemonId) {
    const pokemonData = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const typesDivs = await getPokemonTypes(pokemonData);

    renderBigCard(pokemonData, typesDivs);
}
