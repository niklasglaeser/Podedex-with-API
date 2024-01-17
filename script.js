let allPokemon;
let offset = 0;
let limit = 30;
let currentPokemonData;


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

    document.body.classList.add('no-scroll');
    document.getElementById('allPokemonContainer').classList.add('blur');
    bigCardContainer.style.display = 'flex';
}


function closeBigCard() {
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
            <div class="bigCardButtons">
                <button onClick="showPreviousPokemon(${pokemonData.id})"><img class="previousArrow"src="img/previous.png"></button>
                <button onClick="closeBigCard()"><img class="closeButton"src="img/close.png"></button>
                <button onClick="showNextPokemon(${pokemonData.id})"><img class="nextArrow"src="img/next.png"></button>
            </div>
            <div class="bigCardHeader">
                <div class="bigCardNameTypes">
                    <div class="pokemonNameBig">${pokemonNameCaps}</div>
                    <div class="pokemonTypesBig">${typesDivs}</div>
                </div>
                <div class="pokemonIdBig">${pokemonData.id}</div>
            </div>
            <img class="pokemonImageBig" src="${pokemonData.sprites.other['official-artwork'].front_default}">
            <div class="bigCardBottom">
                <div class="bigCardMenu">
                    <div onClick="renderAbout(currentPokemonData)">About</div>
                    <div onClick="renderBaseStats(currentPokemonData)">Base Stats</div>
                    <div onClick="renderMoves(currentPokemonData)">Moves</div>
                </div>
                <div id="bigCardBottomInfosContainer"></div>
            </div>
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

function renderAbout(currentPokemonData) {
    const bigCardBottomInfosContainer = document.getElementById('bigCardBottomInfosContainer');

    const height = currentPokemonData.height;
    const weight = currentPokemonData.weight;

    let abilitiesString = '';
    for (let i = 0; i < currentPokemonData.abilities.length; i++) {
        abilitiesString += currentPokemonData.abilities[i].ability.name;
        if (i < currentPokemonData.abilities.length - 1) {
            abilitiesString += ', ';
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
                <div class="aboutValue">${abilitiesString}</div>
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

