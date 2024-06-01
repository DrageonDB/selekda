const apiTarget = 'https://pokeapi.co/api/v2/pokemon/ditto';
let result = async () => { 
    const res = await fetch(apiTarget)
    .then(response => {
        return response;
    })
    return await res.json();
}
    
result().then(
    res => {console.log(res)}
);