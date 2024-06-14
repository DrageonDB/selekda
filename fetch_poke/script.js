// API Config
let baseAPIURL = 'https://pokeapi.co/api/v2/pokemon/';

// Pagination config
let limit = 10;
let apiTarget = baseAPIURL;

// Fetch API Config
let callAPI = async () => { 
    const res = await fetch(apiTarget)
    .then(response => {
        return response;
    })
    return await res.json();
}

// Pre-variable
let pagination;
let response;
let responseOfList;

// waiter
const loading = document.querySelector('#loading');
function displayLoading(cond) {
    if (cond) {
        loading.classList.remove('disabled');
    } else {
        loading.classList.add('disabled');
    }
}

// Close pop-up
function togglePopUp(elementId) {
    const el = document.querySelector(elementId);
    el.classList.toggle('d-none');
}

// show poke info
async function showPokeInfo(pokeName) {
    // Pokes
    const pokeNameValue = document.querySelector('#poke-name');
    const pokeHeightValue = document.querySelector('#poke-height');
    const pokeTypesValue = document.querySelector('#poke-types');
    const pokeAbilitiesValue = document.querySelector('#poke-abilities');
    const pokePicValue = document.querySelector('#poke-pic');

    // Poke Name getter
    const valueOfPoke = listOfPokeContents[pokeName];
    
    // Then change it
    console.log(valueOfPoke);
    pokeNameValue.innerHTML = pokeName;
    pokeHeightValue.innerHTML = valueOfPoke['height'] ?? 'N/A';

    let pokeTypes = [];
    for (let i = 0; i < valueOfPoke['types'].length; i++) {
        pokeTypes.push(valueOfPoke['types'][i]['type']['name']);
    }
    pokeTypesValue.innerHTML = pokeTypes.join(', ');

    let abilities = [];
    valueOfPoke['abilities'].forEach(item => {
        abilities.push(item);
    });
    pokeAbilitiesValue.innerHTML = abilities.join(', ');
    pokePicValue.style.background = 'url(' + valueOfPoke['spriteImg'] + ') no-repeat center, #0000003F'
    
    // toggle then
    togglePopUp('.pop-up-container');
}

// Outer function
async function getListOfPokes(page = 1) {
    displayLoading(true);
    pagination.setCurrentPage(page);
    apiTarget = baseAPIURL + '?limit=' + limit + '&offset=' + pagination.getOffset();

    return await callAPI().then((res) => {
        displayLoading(false);
        responseOfList = res['results'];
        updateList();
    });
}

let listOfPokeContents = {};
async function getListOfPokeContents() {
    // clear object firt
    listOfPokeContents = {};

    // then
    const responses = [];
    await Promise.all(responseOfList.map(async (item) => {
        // get responses first
        apiTarget = item['url'];
        await callAPI().then(res => {
            responses.push(res);
        });
    }));

    // then console logging
    const objectBuilder = {
        'spriteImg': null,
        'height': null,
        'types': [],
        'abilities': []
    }

    let cout = 0;
    responses.forEach(item => {
        const build = Object.assign({}, objectBuilder);
        build.spriteImg = item['sprites']['front_default'];
        build.height = item['height'];
        item['types'].forEach(item => {
            build.types.push(item);
        });
        item['abilities'].forEach(item => {
            build.abilities.push(item.ability.name);
        });
        Object.defineProperty(listOfPokeContents, responseOfList[cout]['name'], {
            value: {...build}
        });
        cout++;
    });
    return true;
}

const pokeList = document.querySelector('.pokedex-items');

async function generateListOfPokes() {
    // pre-DOM
    const generatedElements = [];

    function generatePokeElement(pokeName, imageURL = '#') {
        const pokedexItem = document.createElement('div');
        pokedexItem.classList.add('pokedex-item');
        pokedexItem.id = pokeName;
        pokedexItem.setAttribute('onclick', `showPokeInfo('${pokeName}')`);
    
        const pokeImg = document.createElement('img');
        pokeImg.classList.add('poke-img');
        pokeImg.src = imageURL;
        pokeImg.alt = pokeName;
    
        const pokeNameText = document.createElement('span');
        pokeNameText.classList.add('poke-name');
        pokeNameText.innerText = pokeName;
    
        pokedexItem.appendChild(pokeImg);
        pokedexItem.appendChild(pokeNameText);
    
        return pokedexItem;
    }

    responseOfList.forEach(item => {
        const generatedElement = generatePokeElement(item['name'], listOfPokeContents[item['name']].spriteImg);
        generatedElements.push(generatedElement);
    });

    generatedElements.forEach(el => {
        pokeList.appendChild(el);
    });
}

async function updateList() {
    while (pokeList.firstChild) {pokeList.removeChild(pokeList.lastChild);}
    await getListOfPokeContents();
    await generateListOfPokes();
}

// Pre-fetch
callAPI()
    .then(res => {response = res;})
    .then(() => {
        pagination = new MDPager('pokemon-list', limit, response['count'], 1);
        pagination.generatePageSelector(7, 2, 'current-page', `getListOfPokes(this.getAttribute('data-page'));`);
        getListOfPokes(1);
    });
// res => {
//     // Get pagination
//     const amount = response;
//     document.getElementById('debug').innerHTML = JSON.stringify(res);
//     document.getElementById('debug').innerHTML += '<hr>' + res.count;

//     let name = res['name'];
//     let thumbnail = res['sprites']['front_default'];

//     // Process with fetch
//     let height = res['game_indices']['height'];
//     let types = [];
//     res['types'].forEach(item => {
//         types.push(item);
//     });

//     let abilities = [];
//     res['abilities'].forEach(item => {
//         abilities.push(item.ability.name);
//     });

//     console.log(abilities)
// }