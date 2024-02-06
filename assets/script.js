$(document).ready(function(){
    var city = "Error";
    var key = "42b613e734849d215af202db5d90b7dc";
    function displayCities(data){
        $("#options").empty();
        for (let i = 0; i < 5; i++){    
            var cityCountry = data[i].name + " " + data[i].country;
            $("#options").append(`<button class="btn-primary btn" id="city` + i + `">`+ cityCountry +`</button>`);
            $("#city" + i).on("click", null,{cityCountry: cityCountry, lat: data[i].lat, lon: data[i].lon}, function(event){
                event.preventDefault();

                var history = JSON.parse(localStorage.getItem("history"))
                history[history.length] = {"cityCountry": event.data.cityCountry, "lat": event.data.lat, "lon": event.data.lon};
                localStorage.setItem("history", JSON.stringify(history));

                console.log(data);
                $("#options").empty();
                $("#citySearch").val("");
                city = event.data.cityCountry;
                forecast(event.data.lat, event.data.lon);
                weather(event.data.lat, event.data.lon);
                displayHistory();
            });
        }
    }
    function forecast(lat, lon){
        var apiURL = `http://api.openweathermap.org/data/2.5/forecast?lat=`+ lat +`&lon=`+ lon +`&units=metric&appid=`+ key;
        console.log(apiURL)
        fetch(apiURL)
        .then((response) => response.json())
        .then(function(data){
            console.log(data);
            $("#forecasts").empty();
            for(var i = 0; i < 40; i++){
                if(data.list[i].dt_txt.split(" ")[1] === "12:00:00"){
                    $("#forecasts").append(
                        `<div class="bg-secondary">
                            <h3>`+dayjs.unix(data.list[i].dt).format("D/MM/YYYY")+`</h3>
                            <img src="https://openweathermap.org/img/wn/`+ data.list[i].weather[0].icon +`.png">
                            <h4>Temp:`+data.list[i].main.temp +` °C</h4>
                            <h4>Wind:`+data.list[i].wind.speed+` km/h</h4>
                            <h4>Humidity:`+data.list[i].main.humidity+` %</h4>
                        </div>`
                    );
                }
            }
        });

    }
    function weather(lat, lon){
        var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=`+ lat +`&lon=`+ lon +`&units=metric&appid=`+ key;
        fetch(apiURL)
        .then((response) => response.json())
        .then(function(data){
            $("#today").empty();
            $("#today").append(`
                <h2>`+city+ " ("+dayjs.unix(data.dt + data.timezone).format("D/MM/YYYY")+`)</h2>
                <img src="https://openweathermap.org/img/wn/`+ data.weather[0].icon +`.png"></img>
                <h4>Temp:`+data.main.temp+` °C</h4>
                <h4>Wind:`+data.wind.speed+` km/h</h4>
                <h4>Humidity:`+data.main.humidity+` %</h4>
            `)
        });
    }
    $("#citySearch").submit(function(event){
        event.preventDefault();
        getCoords($("#citySearchBar").val());
    });
    function getCoords(city){
        var locationApiURL = `http://api.openweathermap.org/geo/1.0/direct?q=`+city+`&limit=5&appid=`+ key;
        console.log(locationApiURL);
        fetch(locationApiURL)
        .then(response => response.json())
        .then(function(data){
            displayCities(data);
        });
    }
    function displayHistory(){
        var history = localStorage.getItem("history");
        if (history){
            history = JSON.parse(history)
            $("#history").empty();
            for (var i = 0; i < history.length; i++){
                city = history[i].cityCountry;
                $("#history").append(`<button class="btn-secondary btn" id="city` + i + `">`+ city +`</button>`);
                $("#city" + i).on("click", null,{cityCountry: city, lat: history[i].lat, lon: history[i].lon}, function(event){
                    city = event.data.cityCountry;
                    forecast(event.data.lat, event.data.lon);
                    weather(event.data.lat, event.data.lon);
                });
            }
            if (history.length > 5){
                history.shift();
                localStorage.setItem("history", JSON.stringify(history));
            }
        } else {
            localStorage.setItem("history", "[]");
        }
    }
    displayHistory();
});