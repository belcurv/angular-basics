var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {

    $routeProvider
    
        .when('/', {
            templateUrl: 'pages/main.html',
            controller : 'mainController'
        })
    
        .when('/second', {
            templateUrl: 'pages/second.html',
            controller : 'secondController'
        })

        .when('/second/:num', {
            templateUrl: 'pages/second.html',
            controller : 'secondController'
        });
    
});

myApp.service('nameService', function () {

    var self = this;   // trick to reference the outer 'this' inside nameLength method
    this.name = 'John Doe';
    
    this.nameLength = function () {
    
        return self.name.length;
    
    };

});

myApp.controller('mainController', ['$scope', '$log', 'nameService', function ($scope, $log, nameService) {
    
    $scope.name = nameService.name;
    
    // if we need to update a value in a singleton whenever the value changes in the scope,
    // we have to do it manually - Angular can't to everything for us.
    // Have to watch Angular's digest loop for the change, and then update the service value.
    $scope.$watch('name', function () {
        nameService.name = $scope.name;
    });
    
    $log.log(nameService.name);
    $log.log(nameService.nameLength());
    
    $scope.person = {
        name: 'John Doe',
        address: '555 Main St., New York NY 11111'
    };
    
}]);

myApp.controller('secondController', ['$scope', '$log', '$routeParams', 'nameService', function ($scope, $log, $routeParams, nameService) {
    
    $scope.name = nameService.name;
    
    // if we need to update a value in a singleton whenever the value changes in the scope,
    // we have to do it manually - Angular can't to everything for us.
    // Have to watch Angular's digest loop for the change, and then update the service value.
    $scope.$watch('name', function () {
        nameService.name = $scope.name;
    });
    
    $scope.num = $routeParams.num || 'None specified';
    
}]);

myApp.directive('searchResult', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/searchresult.html',
        replace: true,
        scope: {
            personName: "@",
            personAddress: "@"
        }
    }
});