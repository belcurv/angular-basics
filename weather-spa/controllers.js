// ================================ Controllers ===============================
weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function ($scope, $location, cityService) {
    
    $scope.city = cityService.city;
    
    $scope.$watch('city', function () {   // watch the $scope bound textbox for changes.
        cityService.city = $scope.city;   // If it changes, update city in our service
    });
    
    $scope.submit = function () {
        $location.path('/forecast');  
    };
    
}]);

weatherApp.controller('forecastController', ['$scope', '$routeParams', 'cityService', 'weatherService', function ($scope, $routeParams, cityService, weatherService) {
    
    $scope.city = cityService.city;
    
    $scope.days = $routeParams.days || '2';
    
    $scope.weatherResult = weatherService.GetWeather($scope.city, $scope.days);
    
    $scope.convertToFarenheit = function (degK) {
        
        return Math.round((1.8 * (degK - 273)) + 32);
    };
    
    $scope.convertToDate = function (dt) {
        
        return new Date(dt * 1000);
        
    };
    
}]);