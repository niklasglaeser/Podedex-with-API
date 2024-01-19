let allPokemon;
let offset = 0;
let limit = 30;
let currentPokemonData;
let isBigCardOpen = false;

async function loadPokemon() {
    document.getElementById('allPokemonContainer').style.display = 'none';
    document.getElementById('loadMoreButtonContainer').style.display = 'none';
    document.getElementById('bigCardContainer').style.display = 'none';

    showLoadingSpinner();

    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    allPokemon = await response.json();

    await renderAllPokemon();

    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('allPokemonContainer').style.display = 'flex';
    document.getElementById('loadMoreButtonContainer').style.display = 'block';
}


window.onload = async function() {
    await loadPokemon();
};

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
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
        const coloredPokemonCard = `<div ${isBigCardOpen ? 'style="pointer-events: none;"' : ''} onClick="openBigCard(${pokemonData.id})" class="pokemonCard ${type}Background">${pokemonCard}</div>`;

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
    if (isBigCardOpen) {
        return;
    }
    isBigCardOpen = true;

    const pokemonData = await getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const typesDivs = await getPokemonTypes(pokemonData);

    renderBigCard(pokemonData, typesDivs);
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const bigCardContainer = document.getElementById('bigCardContainer');
    bigCardContainer.style.top = `${scrollY}px`;

    document.body.classList.add('no-scroll');
    document.getElementById('allPokemonContainer').classList.add('blur');
    bigCardContainer.style.display = 'flex';

    document.addEventListener('click', closeBigCardOnClickOutside);

}

function closeBigCardOnClickOutside(event) {
    const bigCardContainer = document.getElementById('bigCardContainer');
    if (!bigCardContainer.contains(event.target)) {
        closeBigCard();
        document.removeEventListener('click', closeBigCardOnClickOutside);
    }
}

function closeBigCard() {
    isBigCardOpen = false;
    document.body.classList.remove('no-scroll');
    document.getElementById('allPokemonContainer').classList.remove('blur');

    const bigCardContainer = document.getElementById('bigCardContainer');
    bigCardContainer.style.display = 'none';

    bigCardContainer.style.top = '0';
}


async function renderBigCard(pokemonData, typesDivs) {
    const bigCardContainer = document.getElementById('bigCardContainer');
    bigCardContainer.innerHTML = pokemonCardTemplateBig(pokemonData, typesDivs);

    await renderAbout(pokemonData);
    
    currentPokemonData = pokemonData;
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


function renderAbout(currentPokemonData) {
    const bigCardBottomInfosContainer = document.getElementById('bigCardBottomInfosContainer');

    const height = currentPokemonData.height;
    const weight = currentPokemonData.weight;

    let abilities = '';
    for (let i = 0; i < currentPokemonData.abilities.length; i++) {
        abilities += currentPokemonData.abilities[i].ability.name;
        if (i < currentPokemonData.abilities.length - 1) {
            abilities += ', ';
        }
    }

    const aboutContent = `
        <div class="aboutInfoContainer">
            <div class="aboutInfo">
                <div class="aboutTitle">Height</div>
                <div class="aboutValue">${height} dm</div>
            </div>
            <div class="aboutInfo">
                <div class="aboutTitle">Weight</div>
                <div class="aboutValue">${weight / 10} kg</div>
            </div>
            <div class="aboutInfo">
                <div class="aboutTitle">Abilities</div>
                <div class="aboutValue">${abilities}</div>
            </div>
        </div>
    `;

    bigCardBottomInfosContainer.innerHTML = aboutContent;
}


async function renderBaseStats(currentPokemonData) {
    const bigCardBottomInfosContainer = document.getElementById('bigCardBottomInfosContainer');

    const stats = currentPokemonData.stats;

    let statsContent = '';
    for (let i = 0; i < stats.length; i++) {
        const statName = stats[i].stat.name;
        const baseStat = stats[i].base_stat;

        statsContent += `
            <div class="baseStatInfo">
                <div class="baseStatTitle">${statName}</div>
                <div class="baseStatValue">${baseStat}</div>
            </div>
        `;
    }

    const baseStatsContent = `
        <div class="baseStatsContainer">
            ${statsContent}
        </div>
    `;

    bigCardBottomInfosContainer.innerHTML = baseStatsContent;
}

async function renderMoves(currentPokemonData) {
    const bigCardBottomInfosContainer = document.getElementById('bigCardBottomInfosContainer');

    const moves = currentPokemonData.moves;

    let movesContent = '';
    for (let i = 0; i < moves.length; i++) {
        const moveName = moves[i].move.name;

        movesContent += `
            <div class="moveInfo">
                <div class="moveName">${moveName}</div>
            </div>
        `;
    }

    const movesContainer = `
        <div class="movesContainer">
            ${movesContent}
        </div>
    `;

    bigCardBottomInfosContainer.innerHTML = movesContainer;
}


function filterPokemon() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const pokemonCards = document.getElementsByClassName('pokemonCard');

    for (let i = 0; i < pokemonCards.length; i++) {
        const card = pokemonCards[i];
        const pokemonName = card.getElementsByClassName('pokemonName')[0].textContent.toLowerCase();

        if (pokemonName.includes(searchInput)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    }
    loadMoreButton.style.display = 'none';
}