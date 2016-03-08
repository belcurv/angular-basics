/*
 * app.js
*/

var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', function($scope, $filter) {
    
    $scope.handle = '';
    
    $scope.lowercaseHandle = function() {
        return $filter('lowercase')($scope.handle);
    };
    
    // what if we want our twitter handle to be exactly 5 characters?
    $scope.characters = 5;
    
    $scope.rules = [
        { rulename: "Must be 5 characters" },
        { rulename: "Must not be used elsewhere" },
        { rulename: "Must be cool" }
    ];
    
}]);