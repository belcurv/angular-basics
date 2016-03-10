## Single Page Applications

SPAs are the preferred method for creating web applications because the UI can be made nicer (no blinking and fancy transition animations), but also because less data gets fetched.  We only load partial views instead of reloading all the scaffolding and other page infrastructure each time.  This reduces data transmission and also increases the perceived responsiveness.

The browser only downloads the whole app once.  And then we use AJAX behind the scenes using the hash.

**Single Page Apps and the Hash**

Example hash: #bookmark.  That's called a **fragment identifier**.  Been around for a long time.  We can do something interesting with it.

Javascript has a native event listener: _hashchange_

```javascript
window.addEventListener('hashchange', function () {

    console.log('Hash Changed!: ' + window.location.hash);

});
```

When we click on #bookmark, the event listener sees the hash change and fires a callback.

You don't even need a real anchor on the page for this to work.  We can put whatever we want into the has value / fragment identifier:

    localhost:3000/index.html#/bookmark
    localhost:3000/index.html#/boogermark
    localhost:3000/index.html#/bookburners

Those are just strings - we can even extend this to appear like a folder hierarchy:

    localhost:3000/index.html#/bookmark/2
    localhost:3000/index.html#/bookmark/3

It's not really a folder hierarchy, but we can pretend that it means something.  And we can work with this:

```javascript
window.addEventListener('hashchange', function () {

    if (window.location.hash === '#/bookmark/1') {
        console.log('Page 1 is cool.');
    }
    
    if (window.location.hash === '#/bookmark/2') {
        console.log('Let me go get Page 2.');
    }
    
    if (window.location.hash === '#/bookmark/3') {
        console.log('Here\'s page 3.');
    }

});
```

We're mimicing what a normal URL does.  From the browser's perspective, you're not telling it to go out and actually get stuff, becuase the anchor doesn't exist.  But from a javascript perspective, I can look at the value of a hash and do whatever I want.


## Routing, Templates and Controllers

AngularJS knows what the hash is.  We can prove this using the $location service with the .path() method:

```javascript
myApp.controller('mainController', ['$scope', '$location', '$log', function($scope, $location, $log) {

    $log.info($location.path());

}]);
```

The above logs hash locations to the browser's console.  For example, browsing to `localhost:3000/index.html#/bookmark/1` will output the following:

`/bookmark/1'

That means we can write code against that concept.  This has already been done for us: 

## ngRoute

**angular-route.js**:

https://code.angularjs.org/1.5.0/angular-route.js
https://code.angularjs.org/1.5.0/angular-route.min.js

Include it in the view and we have routing available:

`<script src="https://code.angularjs.org/1.5.0/angular-route.min.js"></script>`

Then in the app side, we have to:
1)  inject ngRoute into the module dependencies.
2)  configure the application to use it.  .config is a method that takes a function, and that function takes the $routeProvider service from the ngRoute module.
3)  $routeProvider lets us specify routes based on specific things _or patterns_ in the hash.
4)  $routeProvier's .when methods spec the routes.  .when takes the URI and an object consisting of what to do when that URI is hit.
5)  The object needs at least two things: templateUrl and controller.

```javascript
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
    
});

myApp.controller('mainController', ['$scope', '$log', function($scope, $log) {
    
}]);

myApp.controller('secondController', ['$scope', '$log', function($scope, $log) {
    
}]);

```

Now that ngRoute is handling controller assignment, we no longer need the ng-controller in our index.html view.  Instead we use ng-view:

```
<div class="container">

    <div ng-view></div>

</div>
```

Angular drops all the template content right into the DOM where ng-view is.  So, set up your controllers, set up $routeProvider, and set up your pages.

## What about ngRoute and querystrings?

Angular facilitates this via pattern matching:

```javascript
myApp.config(function ($routeProvider) {

    $routeProvider
    
    //...//
    
    .when('/second/:whatever', {
        templateUrl: 'pages/main.html',
        controller : 'mainController'
    });
    
});
```

Where the `:whatever` is the pattern to match.  Can have multiple patterns inside a hash/route:

```javascript
    .when('/second/:num/something/:id', {
```

This: `.when('/second/:whatever'` says I'm going to look for /second/_something_ inside the hash, and I can use that value inside the controller.  But first we need to inject $routeParams (service from ngRoute) into the appropriate controller:

```javascript
myApp.controller('secondController', ['$scope', '$log', '$routeParams', function($scope, $log, $routeParams) {

    $scope.num = $routeParams.num;

}]);
```

This is cool because we can pass values, via the hash, between URLs.