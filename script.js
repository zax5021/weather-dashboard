var searchCityEl = $("#searchField");
var searchBtn = $("#search-addon")
var pastSearchesEl = $("#pastSearches");
var heroListEl = $(".hero-list-group");
var heroCardEl = $(".hero-card");
var forecastCardsEl = $("#forecastCards");
var pastSearchesUl = $("#pastSearchesUl")
var searchCity;
var searchCityCoords;
var cityWeather;
var saveCityObject= {};
var savedSearches = [];

function searchSubmit (){
    searchCity = searchCityEl.val();
    
 getCoord();
}


function getCoord (){
   
    //made api key not work by adding F to beginning
    var apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + searchCity + "&key=3eb93ae01e55489188eadd7629028315&pretty=1";
    console.log(apiUrl)
    fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (response) {
       var cityResponse= response.results[0]
    if (!response.results.length) {
        console.log('No City found!');
        heroCardEl.children("h5").text("No results found, search again!");
      } 
        searchCityCoords = {
            latitude: cityResponse.geometry.lat,
            longitude: cityResponse.geometry.lng
        }
            console.log(searchCityCoords)
    })
    .then(getWeather)
    .catch(function (error) {
      console.error(error);
    });
    // Commenting out to try the async thing
    // getWeather();
} 

function getWeather() {
    // searchCityCoords = {
    //     latitude: 32.7174202,
    //     longitude: -117.1627728
    // }
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + searchCityCoords.latitude + "&lon=" + searchCityCoords.longitude +"&exclude=hourly,minutely&appid=09067483d1a4888ae997aa4f31004a36";
    console.log(weatherApiUrl)
    fetch(weatherApiUrl)
    .then(function (data) {
      if (!data.ok) {
        throw data.json();
      }

      return data.json();
    })
    .then(function (data) {
    cityWeather= data
   saveSearch()
    // renderWeather()

    })
}

function saveSearch() {
    saveCityObject = {
        name: searchCity,
        Coords: searchCityCoords,
    }
    savedSearches.push(saveCityObject)
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches))
}
// TODO write renderWeather function
// function renderWeather() {

// }
function renderSavedSearches() {
    
    
    for (i=0; i<savedSearches.length; i++){
        var pastSearchesIl = document.createElement("li");
        $(pastSearchesIl).addClass("list-group-item list-group-item-action");
        $(pastSearchesIl).text(savedSearches[i].name);
        console.log(pastSearchesIl);
        pastSearchesUl[0].appendChild(pastSearchesIl);
    }
    
}

function init(){
    savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
    console.log(savedSearches[0].name);
    console.log(pastSearchesUl)
    renderSavedSearches();
}

init()
searchBtn.on("click", searchSubmit)