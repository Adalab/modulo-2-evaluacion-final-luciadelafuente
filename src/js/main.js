'use strict';

// Variables globales
const inputSearch = document.querySelector('.js-input-search');
const btnSearch = document.querySelector('.js-btn-search');
const ulDrinks = document.querySelector('.js-drink-list');
const ulFavoritesDrinks = document.querySelector('.js-fav-drink-list');
const btnResetFavorites = document.querySelector('.js-btn-reset-fav');
const searchNotFoundText = document.querySelector('.js-search-text');
const favoritesMainTitle = document.querySelector('.js-favorites-maintitle');
const drinksMainTitle = document.querySelector('.js-drinks-maintitle');
const favoritesSectionGift = document.querySelector('.js-fav-gift');
const btnReset = document.querySelector('.js-btn-reset');

// Arrays globales
let drinks = [];
let favoritesDrinks = [];


// Función render para pintar cada bebida
const renderOneDrink = (eachDrink, favoriteClass) => {
    let html = "";
    let alcholicText = eachDrink.strAlcoholic === 'Alcoholic' ? 'Tiene alcohol': 'Sin alcohol';
    if(eachDrink.strDrinkThumb !== ''){
        html = `<li class="drink js-drink ${favoriteClass}" id="${eachDrink.idDrink}">
        <h3 class="drink__title">${eachDrink.strDrink}</h3>
        <p class="drink__text">${alcholicText}</p>
        <img class="drink__image" src="${eachDrink.strDrinkThumb}" alt="">
     </li>`
    }else{
        html = `<li class="js-drink ${favoriteClass}" id="${eachDrink.idDrink}">
        <h3>${eachDrink.strDrink}</h3>
        <p class="drink__text">${alcholicText}</p>
        <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=NOTIMAGEFOUND" alt="">
     </li>`
    }
   ;
    return html;
};

// Función borrar un favorito
function handleDeleteFavorite(event){
    event.preventDefault();
    ulFavoritesDrinks.removeChild(newItem);
    const liClickedId = newItem.id;
    const favoriteLiClickedIndex = favoritesDrinks.findIndex((item) => item.idDrink === liClickedId);
    favoritesDrinks.splice(favoriteLiClickedIndex, 1);
    localStorage.removeItem(liClickedId);
    newItem4.classList.add('hidden');
    renderAllDrinks(drinks);
    hideControlResetButton();
};

// Función borrar todos los favoritos
function handleDeleteAllFavorites(event){
    ulFavoritesDrinks.replaceChildren();
    localStorage.clear();
    favoritesDrinks = [];
    renderAllDrinks(drinks);
    hideControlResetButton();
}

// Función pintar en consola nombre favorito clickado
function handleClickTitle(event){
    const idFavClicked = event.currentTarget.id;
    const drinkFavClicked =  favoritesDrinks.find((item) => item.idDrink === idFavClicked);
    console.log(drinkFavClicked.strDrink);
}
// Función render para pintar los favoritos
function renderFavoriteDrink(favDrink){
        const newItem = document.createElement('li');
        const newItem2 = document.createElement('h3');
        const newItem3 = document.createElement('img');
        const newItem4 = document.createElement('button');
        newItem3.src = favDrink.strDrinkThumb;
        const newContent = document.createTextNode(`${favDrink.strDrink}`);
        const newContent2 = document.createTextNode(`X`);
        newItem4.appendChild(newContent2);
        newItem2.appendChild(newContent);
        newItem.classList.add('favorites-changes');
        newItem.id = favDrink.idDrink;
        newItem.appendChild(newItem2);
        newItem.appendChild(newItem3);
        newItem.classList.add('favorites__li');
        newItem2.classList.add('favorites__title');
        newItem3.classList.add('favorites__image');
        newItem4.classList.add('favorites__btnx');
        btnResetFavorites.classList.remove('hidden');
        favoritesMainTitle.classList.remove('hidden');
        ulFavoritesDrinks.appendChild(newItem4);
        ulFavoritesDrinks.appendChild(newItem);
        
        newItem4.addEventListener('click', handleDeleteFavorite);
        btnResetFavorites.addEventListener('click', handleDeleteAllFavorites);
        newItem.addEventListener('click', handleClickTitle);

};

// Función añadir a favoritos
const addFavoritesDrinks = (event) => {
    console.log(event.currentTarget.id);
    const idListClicked = event.currentTarget.id;
    const drinkClicked = drinks.find((item) => item.idDrink === idListClicked);
    //verificar si la bebida buscada ya es un favorito
    const favoriteListClickedIndex = favoritesDrinks.findIndex((item) => item.idDrink === idListClicked);
    //favoriteListClickedIndex da -1 cuando el id no se encuentra en el array
    if(favoriteListClickedIndex === -1){
        //añadir la bebida a mi array de favoritos si no está
        favoritesDrinks.push(drinkClicked);
        renderFavoriteDrink(drinkClicked);
        localStorage.setItem(idListClicked, JSON.stringify(drinkClicked));
        renderAllDrinks(drinks);
        hideControlResetButton();
    }
    console.log(favoritesDrinks);
};


// Función render para pintar todas las bebidas que coinciden con la búsqueda
const renderAllDrinks = (array) => {
    ulDrinks.innerHTML = "";
    for (let i = 0; i < array.length; i++ ){
        const idFavorite = favoritesDrinks.findIndex((item) => item.idDrink === array[i].idDrink);
        let favoriteClass = "";
        if (idFavorite !== -1){
            favoriteClass = "favorites-changes";
        }
        ulDrinks.innerHTML += renderOneDrink(array[i], favoriteClass);
    }
    drinksMainTitle.classList.remove('hidden');
    const allDrinksList = document.querySelectorAll('.js-drink');
    for (const eachList of allDrinksList) {
        eachList.addEventListener('click', addFavoritesDrinks)
    }

};
    
// Función para traer los datos de la API
function getDataAPI(){
    const valueInputSearch = inputSearch.value;
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${valueInputSearch}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    drinks = data.drinks;
    console.log(drinks);
    if(drinks === null){
        searchNotFoundText.innerHTML = "No disponemos de ningún cóctel que coincida con tu búsqueda.";
    }else{
        renderAllDrinks(drinks);
        searchNotFoundText.innerHTML = "";
    }
  });
};

// Función para recoger los datos de los margarita y que los pinte
function getMargaritaAPI(){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    drinks = data.drinks;
    renderAllDrinks(drinks);
  });
};

// Función que recoge los datos favoritos del local
function favoritesLocal(){
    for (let i = 0; i < localStorage.length; i++) {
        let keyLocalStorage = localStorage.key(i);
        const valueLocalStorage = localStorage.getItem(keyLocalStorage);
        const favoriteDrink = JSON.parse(valueLocalStorage);
        favoritesDrinks.push(favoriteDrink);
        renderFavoriteDrink(favoriteDrink);
    }
};

// Función manejadora del evento sobre el botón de buscar
function handleClick(event){
    event.preventDefault();
    if (inputSearch.value === ""){
        searchNotFoundText.innerHTML = "No se ha introducido ningún cocktail en la barra de búsqueda.";
    }else{
        searchNotFoundText.innerHTML = "";
        getDataAPI();
    } 
};

// Función botón reset búsqueda
function handleClickReset(event){
    getMargaritaAPI();
    inputSearch.value = "";
}

// Función que se pinta cuando carga la página
function initialPage(){
    hideControlResetButton();
    getMargaritaAPI();
}

// Función que oculta botón de reset favoritos cuando no hay favoritos y muestra el gift, o al contrario
function hideControlResetButton(){
    if(favoritesDrinks.length === 0){
        btnResetFavorites.classList.add('hidden');
        favoritesSectionGift.classList.remove('hidden');         
    }else{
        favoritesSectionGift.classList.add('hidden');
        btnResetFavorites.classList.remove('hidden'); 
    }
}


// Lo que se ve cuando carga la página
favoritesLocal();
initialPage();


btnSearch.addEventListener('click', handleClick);
btnReset.addEventListener('click', handleClickReset)
