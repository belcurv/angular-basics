// ================================= Services =================================
weatherApp.service('cityService', function () {
    
    this.city = 'Chicago';   // prefill form with Chicago
    
});

weatherApp.service('weatherService', ['$resource', function ($resource) {
    
    this.GetWeather = function (city, days) {
        var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }} );

        // using appid: b1b15e88fa797225412429c1c50c122a
        return weatherAPI.get({
            q: city,
            cnt: days,
            appid: 'b1b15e88fa797225412429c1c50c122a'
        });
    };
    
}]);