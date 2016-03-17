/*
 * app.js
*/

var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', '$http', function($scope, $filter, $http) {
    
    $scope.handle = '';
    
    $scope.lowercaseHandle = function() {
        return $filter('lowercase')($scope.handle);
    };
    
    // what if we want our twitter handle to be exactly 5 characters?
    $scope.characters = 5;
    

    // send a GET request to /api, which returns a JSON object.
    // the JSON object is stored as 'result', which we then use to populate
    //   $scope.rules.  $scope.rules, in turn is used by the DOM in the <ul> loop.
    $http.get('/api')
        .success(function (result) {
            $scope.rules = result;
        })
        .error(function (data, status) {
            console.log(data);
        });
    
    // POST
    $scope.newRule = '';
    $scope.addRule = function () {
        $http.post('/api', { RuleName: $scope.newRule })
        
            .success(function (result) {
                console.log(result);
                $scope.rules = result;
                $scope.newRule = '';
            })
            .error(function (data, status) {
                console.log(data);
            });
    }
    
    
}]);