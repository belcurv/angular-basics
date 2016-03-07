/*
 * app.js
*/

var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', function($scope, $filter) {
    
    $scope.handle = '';
    
    $scope.lowercaseHandle = function() {
        return $filter('lowercase')($scope.handle);
    };
    
    $scope.$watch('handle', function(newValue, oldValue) {
        
        console.info('Changed!');
        console.log('Old: ' + oldValue);
        console.log('New: ' + newValue);
        
    });
    
    setTimeout(function() {
    
        $scope.$apply(function() {  // .$apply adds this code to the digest cycle / watch list
            $scope.handle = 'newtwitterhandle';
            console.log('Scope changed!');
        });
    
    }, 3000);
    
}]);