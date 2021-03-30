// @ts-check
var searchCityEl = $("#searchField");
var searchBtn = $("#search-addon")
var pastSearchesEl = $("#pastSearches");
var heroListEl = $(".hero-list-group");
var heroCardEl = $(".hero-card");
var forecastCardsEl = $("#forecastCards");
var heroH5 = heroCardEl.children("h5")
var pastSearchesUl = $("#pastSearchesUl")
var iconEl = document.createElement("img")
var searchCity;
var searchCityCoords;
var cityWeather;
var saveCityObject= {};
var savedSearches = [] ;
var storedSearches;
var savedSearcheslist;


function searchSubmit (){
    searchCity = searchCityEl.val();
    pastSearchesUl.children().removeClass("active")
 getCoord();
}
function getCoord (){
    
    var apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + searchCity + "&key=3eb93ae01e55489188eadd7629028315&pretty=1";
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
        heroCardEl.removeClass("hidden");
        heroCardEl.children("h5").text("No results found, search again!");
        return
      } 
        searchCityCoords = {
            latitude: cityResponse.geometry.lat,
            longitude: cityResponse.geometry.lng
        }
    })
    .then(getWeather)
    .catch(function (error) {
      console.error(error);
    });
} 

function getWeather() {

    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + searchCityCoords.latitude + "&lon=" + searchCityCoords.longitude +"&units=imperial&exclude=hourly,minutely&appid=09067483d1a4888ae997aa4f31004a36";
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
    if (!searchCityEl.val()) {
        return
    }
    savedSearcheslist = savedSearches.map(({name})=> name)
    if (savedSearcheslist.includes(searchCity)){
        return
    }
    saveCityObject = {
        name: searchCity,
        Coords: searchCityCoords,
    }
    savedSearches.push(saveCityObject)
    localStorage.setItem("savedSearchesLocal", JSON.stringify(savedSearches))
}
function renderWeather() {
    var curTemp = cityWeather.current.temp
    var curWindSpeed = cityWeather.current.wind_speed
    var curHumidity = cityWeather.current.humidity
    var curUV = cityWeather.current.uvi
    var curIcon = cityWeather.current.weather[0].icon
    var curVars = [curTemp, curHumidity, curWindSpeed, curUV]
    var heroH5 = heroCardEl.children("h5")

    heroCardEl.removeClass("hidden")
    heroCardEl.children("h5").text(searchCity)
    $(iconEl).attr("src", "https://openweathermap.org/img/wn/" + curIcon + "2x.png")
    $(iconEl).attr("class", "weatherIcon")
    heroH5[0].appendChild(iconEl)
    heroCardEl.children("h5").children().attr("src", "https://openweathermap.org/img/wn/" + curIcon + "@2x.png")
    for (var i=0; i<4; i++) {
        heroCardEl.children("ul").children("li").eq(i).children().first().text(curVars[i])
    }
    if (curUV >= 3){
        heroCardEl.children("ul").children("li").eq(3).children().first().attr("style", "color:orange")
    } else if (curUV >=6){
        heroCardEl.children("ul").children("li").eq(3).children().first().attr("style", "color:red")
    } else {
        heroCardEl.children("ul").children("li").eq(3).children().first().attr("style", "color:green")
    }

    var dailyWeather = cityWeather.daily
    var dailyIcon = 

    forecastCardsEl.removeClass("hidden")
    for (i=1;i<6;i++){
        idx= i-1;
        forecastCardsEl.children().eq(idx).children("h5").text(moment().add(i, "d").format("l"))
        forecastCardsEl.children().eq(idx).children("ul").children("li").eq(0).children().attr("src", "https://openweathermap.org/img/wn/" + cityWeather.daily[i].weather[0].icon + "@2x.png")
        forecastCardsEl.children().eq(idx).children("ul").children("li").eq(1).children().first().text(dailyWeather[i].temp.max)
        forecastCardsEl.children().eq(idx).children("ul").children("li").eq(2).children().first().text(dailyWeather[i].humidity)
    }
}

function renderSavedSearches() {
    if(savedSearches.length===0){
        return
    }else{
    for (i=0; i<savedSearches.length; i++){
        var pastSearchesIl = document.createElement("li");
        $(pastSearchesIl).addClass("list-group-item list-group-item-action");
        $(pastSearchesIl).attr("data-city", savedSearches[i].name);
        $(pastSearchesIl).text(savedSearches[i].name);
        pastSearchesUl[0].appendChild(pastSearchesIl);
    }    

}}
//TODO Clicking on lis should search that city and render the weather, also switch the li to active. Prevent new searches that match city name from adding a new li. 
function addSavedSearch() {
    if (!searchCityEl.val()) {
        return
    }
    if (savedSearcheslist.includes(searchCity)){
            var matchedCityIdx = savedSearcheslist.indexOf(searchCity)
            pastSearchesUl.children().eq(matchedCityIdx).addClass("active")
            return
        }
    savedSearches = JSON.parse(localStorage.getItem("savedSearchesLocal"));
    var pastSearchesIl = document.createElement("li");
    $(pastSearchesIl).addClass("list-group-item list-group-item-action active");
    $(pastSearchesIl).text(savedSearches[savedSearches.length-1].name);
    pastSearchesUl[0].appendChild(pastSearchesIl);
    searchCityEl.val("")
}



function init(){
  storedSearches = JSON.parse(localStorage.getItem("savedSearchesLocal"))
   if(!storedSearches){
    return
} 
for (i=0; i< storedSearches.length; i++){
    savedSearches.push(storedSearches[i])
}
    renderSavedSearches();
}

init()
searchBtn.on("click", searchSubmit)
pastSearchesUl.on("click", (event) => {
    event.preventDefault();
    searchCityEl.val("")
    searchCity = $(event.target).text()
    pastSearchesUl.children().removeClass("active")
    $(event.target).addClass("active")
    getCoord();
})
