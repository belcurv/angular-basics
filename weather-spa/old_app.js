/*
 * app.js
 *
 * This is the everything-in-one-file file, before modularizing components
 * into their own separate files.
*/

// ================================== Module ==================================
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);


// ================================== Routing =================================
weatherApp.config(function ($routeProvider) {
    
    $routeProvider
    
        .when('/', {
            templateUrl: 'pages/home.html',
            controller : 'homeController'
        })

        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller : 'forecastController'
        })
    
        .when('/forecast/:days', {
            templateUrl: 'pages/forecast.html',
            controller : 'forecastController'
        });
    
});


// ================================= Services =================================
weatherApp.service('cityService', function () {
    
    this.city = 'Chicago';   // prefill form with Chicago
    
});


// ================================ Controllers ===============================
weatherApp.controller('homeController', ['$scope', 'cityService', function ($scope, cityService) {
    
    $scope.city = cityService.city;
    
    $scope.$watch('city', function () {   // watch the $scope bound textbox for changes.
        cityService.city = $scope.city;   // If it changes, update city in our service
    });
    
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function ($scope, $resource, $routeParams, cityService) {
    
    $scope.city = cityService.city;
    
    $scope.days = $routeParams.days || '2';
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",
                                  { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    
    $scope.weatherResult = $scope.weatherAPI.get(
        {
            q: $scope.city,
            cnt: $scope.days,
            appid: 'b1b15e88fa797225412429c1c50c122a'
        }
    );
    
    $scope.convertToFarenheit = function (degK) {
        
        return Math.round((1.8 * (degK - 273)) + 32);
    };
    
    $scope.convertToDate = function (dt) {
        
        return new Date(dt * 1000);
        
    };
    
}]);


// ================================ Directives ================================
weatherApp.directive('weatherPanel', function () {
    return {
        restrict: 'AE',
        templateUrl: 'directives/weatherpanel.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToStandard: '&',
            convertToDate: '&',
            dateFormat: '@'
        }
    }
});