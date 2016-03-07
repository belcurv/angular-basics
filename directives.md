### Directives and Two Way Data Binding

Directive: An instrution to AngularJS to manipulate a piece of the DOM.  This could be 'ADD A CLASS', 'HIDE THIS', 'CREATE THIS', etc.

Instead of manually changing the DOM with js or jQuery, Angular prefers we use directives.

One way angular implements its directives is like this: custom attributes.  Our first directives were the ng-app and ng-controller directives - both custom attributes.

Another custom attribute / directive: **ng-model**.  Binds an element to a specific variable/property in the $scope.

```
<div>
    <label>What is your twitter handle?</label>
        <input type="text" ng-model="handle" />
    </div>

    <hr />
    <h1>twitter.com/{{ handle }}</h1>
</div>
```

... combined with ...

```
$scope.handle = '';
```

... binds $scope.handle javascript variable to the view in two places.  Update one of them and the other automatically updates.  This gets really powerful with filters:


```
var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', function($scope, $filter) {

    $scope.handle = '';
    $scope.lowercaseHandle = function() {
        return $filter('lowercase')($scope.handle);
    };
}]);
```

... then in the view (lowercaseHandle is a function, so needs '()' )...

```
<h1>twitter.com/{{ lowercaseHandle() }}</h1>
```
