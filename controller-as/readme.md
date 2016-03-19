## Bonus Lecture: Nested Controllers, Clean Code, and 'Controller as'

Angular 1.2 introduced an alternative structure to the $scope service.

You can nest controllers in AngularJS.  It will look first in the $scope of the controller it's inside of, and if it can't find it it will look in the $scope of the next controller up the chain.

What if we need to access a parent's 'something' inside a child controller?  One way - a messy way - is like this:

```
div ng-controller="parent1Controller">
    {{ message }}
    <div ng-controller="child1Controller">
        {{ $parent.message }}
        <br />
        {{ message }}
    </div>
</div>
```

$parent causes Angular to look in the parent's $scope.  This can get messy if you have a lot of controllers.

So there's two other ways to handle this.

## First way: wrap everything inside a containing object

Inside a controller, create a object to incorporate all the methods and properties we want.

```javascript
myApp.controller('parent1Controller', ['$scope', function ($scope) {
    
    $scope.parent1vm = {};   // empty object to collect our stuff
    
    // then attach everything to the empty object:
    $scope.parent1vm.message = 'Parent 1 Message.';

}]);

myApp.controller('child1Controller', ['$scope', function ($scope) {
    
    $scope.child1vm = {};
    
    // then attach everything to the empty object:
    $scope.child1vm.message = 'Child 1 Message.';

}]);
```

Then in the view we:

```
<div ng-controller="parent1Controller">
    {{ parent1vm.message }}
    <div ng-controller="child1Controller">
        {{ parent1vm..message }}
        <br />
        {{ child1vm.message }}
    </div>
</div>
```

This works because Angular will look for the parent1vm object, won't find it in child1controller's $scope, and thus looks inside the parent.

This doesn't affect anything functionally, but it does make code easier to read and understand.

## The Second Way: Controller-As

This is a totally different way of doing it.  First, we can remove the $scope injection from our controllers.  Instead of scope, we'll attach our methods and properties to the controller itself:

```javascript
myApp.controller('parent2Controller', [function () {
    
    this.message = 'Parent 2 Message.';
    
}]);

myApp.controller('child2Controller', [function () {
    
    this.message = 'Child 2 Message.';
    
}]);
```

And we update the view:

```
<div ng-controller="parent2Controller as parent2vm">
    {{ parent2vm.message }}
    <div ng-controller="child2Controller as child2vm">
        {{ parent2vm.message }}
        <br />
        {{ child2vm.message }}
    </div>
</div>
```

We can call them whatever we want.  We used parent2vm and child2vm, so we have to reference those inside the interpolation {{ }} deals.  This works because the methods and properties are attached to the controllers themselves.  The 'as' gives me a name to reference the controller, and we can use it inside {{ }}.

This also works with 2-way binding:

```
<div ng-controller="parent2Controller as parent2vm">
    {{ parent2vm.message }}
    <div ng-controller="child2Controller as child2vm">
        {{ parent2vm.message }}
        <br />
        {{ child2vm.message }}
        <br />
        <input type="text" ng-model="parent2vm.message" />
    </div>
</div>
```

Everything works except adding custom watchers - in that case you have to inject $scope into the controller.

Why do we prefer this method?  It's mostly about clean code and naming stuff.  People like to name a controller and reference it in the view.  It's an aethetic choice, the functionality is the same.