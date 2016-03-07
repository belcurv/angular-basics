/*
 * app.js
*/

var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', function($scope, $filter) {
    
    $scope.handle = '';  // bound to html ng-model attribute
    
    $scope.lowercaseHandle = function() {
        return $filter('lowercase')($scope.handle);
    };
    
}]);