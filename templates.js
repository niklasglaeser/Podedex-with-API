
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
                <button onClick="showPreviousPokemon(${pokemonData.id})"><img class="previousNext"src="img/previous.png"></button>
                <button onClick="closeBigCard()"><img class="closeButton"src="img/close.png"></button>
                <button onClick="showNextPokemon(${pokemonData.id})"><img class="previousNext"src="img/next.png"></button>
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



