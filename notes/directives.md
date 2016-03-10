## Directives and Two Way Data Binding

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

```javascript
$scope.handle = '';
```

... binds $scope.handle javascript variable to the view in two places.  Update one of them and the other automatically updates.  This gets really powerful with filters:


```javascript
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

## Common Directives

**See all of them here:** [**Angular API Reference**](https://docs.angularjs.org/api).

**ng-model:** Two-way data binding.

**ng-if:** tells the DOM what to do under certain circumstances.  Depends on truthyness of a javascript expression in the view.  Example:

```
<div class="alert" ng-if="handle.length !== characters">
    Must be 5 characters!
</div>
```

**ng-show:** Displays a DOM element if some expression is true.  When it's not, Angular toggles ng-hide in the DOM which sets a CSS property: _display: none;_  The inverse is ng-hide...

**ng-hide:** Hides a DOM element if some expression is true.  Modifying our example above:

```
<div class="alert" ng-hide="handle.length === 5">
    Must be 5 characters!
</div>
```

**ng-class:** gets a JSON object.  Takes the name of a CSS class, and the value which is a javascript expression. Example:

```
<div class="alert" ng-class="{ 'alert-warning': handle.length < characters }"
    ng-hide="handle.length === 5">
```

You can also nest these:

```
<div class="alert" ng-class="{ 'alert-warning': handle.length < characters, 'alert-danger': handle.length > characters }" ng-show="handle.length !== characters">

    <div ng-show="handle.length < characters">
        You have less than 5 characters!
    </div>
    <div ng-show="handle.length > characters">
        You have more than 5 characters!
    </div>
</div>
```

**ng-repeat:** This is basically a _for-in_ javascript loop. It repeats the hosting element for each item in the array.  For example, the following repeats the <li> element for each rule in the rules array.  'rule' is just a locally created variable for the sake of ng-repeat.

```
<ul>
    <li ng-repeat="rule in rules">
        {{ rule.rulename }}
    </li>
</ul>
```

**ng-click:** Takes a function that we have on the $scope and responds to the click:

```
(in the view)
<input type="button" value="Click me" ng-click="alertClick()" />

(in the app)
$scope.alertClick = function() {
    alert("Clicked!";)
};
```

**ng-cloak:** Hides rendered page element until Angular is done working on it;

`` <div ng-cloak> {{ name }} </div> ``