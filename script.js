// @ts-check
var searchCityEl = $("#searchField");
var searchBtn = $("#search-addon")
var pastSearchesEl = $("#pastSearches");
var heroListEl = $(".hero-list-group");
var heroCardEl = $(".hero-card");
var forecastCardsEl = $("#forecastCards");
// var forecastListUl = $(".forecast-list-group");
var pastSearchesUl = $("#pastSearchesUl")
var searchCity;
var searchCityCoords;
var cityWeather;
var saveCityObject= {};
var savedSearches = [] ;
var storedSearches;

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
        heroCardEl.removeClass("hidden");
        heroCardEl.children("h5").text("No results found, search again!");
        return
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
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + searchCityCoords.latitude + "&lon=" + searchCityCoords.longitude +"&units=imperial&exclude=hourly,minutely&appid=09067483d1a4888ae997aa4f31004a36";
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
   saveSearch();
    renderWeather()
     addSavedSearch();

    })
}

function saveSearch() {
    saveCityObject = {
        name: searchCity,
        Coords: searchCityCoords,
    }
    // if (savedSearches.length===0){
    //     savedSearches= [
    //         saveCityObject,
    //     ]
    // } else{
    console.log(savedSearches)   
    // if(!savedSearches.includes({name:saveCityObject.name})){
    savedSearches.push(saveCityObject)
    // }
    // }
    localStorage.setItem("savedSearchesLocal", JSON.stringify(savedSearches))
    console
}
// TODO write renderWeather function
function renderWeather() {
    var curTemp = cityWeather.current.temp
    var curWindSpeed = cityWeather.current.wind_speed
    var curHumidity = cityWeather.current.humidity
    var curUV = cityWeather.current.uvi
    var curVars = [curTemp, curHumidity, curWindSpeed, curUV]

    heroCardEl.removeClass("hidden")
    heroCardEl.children("h5").text(searchCity)
    for (var i=0; i<4; i++) {
        heroCardEl.children("ul").children("li").eq(i).children().first().text(curVars[i])
    }

    var dailyWeather = cityWeather.daily

    
    forecastCardsEl.removeClass("hidden")
    for (i=1;i<6;i++){
        idx= i-1;
        forecastCardsEl.children().eq(idx).children("h5").text(moment().add(i, "d").format("l"))
        forecastCardsEl.children().eq(idx).children("ul").children("li").eq(1).children().first().text(dailyWeather[i].temp.max)
        forecastCardsEl.children().eq(idx).children("ul").children("li").eq(2).children().first().text(dailyWeather[i].humidity)
        console.log(dailyWeather[i].temp.max)
    }
    console.log(searchCity)
}


function renderSavedSearches() {
    if(savedSearches.length===0){
        return
    }else{
    for (i=0; i<savedSearches.length; i++){
        var pastSearchesIl = document.createElement("li");
        $(pastSearchesIl).addClass("list-group-item list-group-item-action");
        $(pastSearchesIl).text(savedSearches[i].name);
        pastSearchesUl[0].appendChild(pastSearchesIl);
    }    

}}
//TODO Clicking on lis should search that city and render the weather, also switch the li to active. Prevent new searches that match city name from adding a new li. 
function addSavedSearch() {
    savedSearches = JSON.parse(localStorage.getItem("savedSearchesLocal"));
   var pastSearchesIl = document.createElement("li");
    $(pastSearchesIl).addClass("list-group-item list-group-item-action active");
    $(pastSearchesIl).text(savedSearches[savedSearches.length-1].name);
    pastSearchesUl[0].appendChild(pastSearchesIl);
}

function init(){
  console.log(savedSearches)
  storedSearches = JSON.parse(localStorage.getItem("savedSearchesLocal"))
   if(!storedSearches){
    return
} 
for (i=0; i< storedSearches.length; i++){
    savedSearches.push(storedSearches[i])
}
    // savedSearches.push(storedSearches)
    // }
    console.log(JSON.parse(localStorage.getItem("savedSearchesLocal")))
    console.log(savedSearches.length)
    console.log(typeof savedSearches)
    renderSavedSearches();
}

init()
searchBtn.on("click", searchSubmit)