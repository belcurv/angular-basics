## Singletons and Services

Singleton: the one and _only_ copy of an object. This is a pattern in object oriented programming, meaning I only ever have one of these objects.

Contrast with: I might have a Person object and instantiate (make copies of it) it with a Tony object, a Steve object, etc.  But with a singletonm when I say I have some object, **there's only one**.  Whenever you ask for it, you're never getting a copy - you're getting **the one**.

AngularJS services are singletons.

Take $log for example.  We might have two controllers that inject the $log service:

```javascript
    myApp.controller('mainController', ['$scope', '$log', function($scope, $log) {
    
        $scope.name = 'Main';
        
        // add 'main' property to the $log object
        $log.main = 'Property from main';
        $log.log($log);     // nothing like logging yourself :D

    }]);

    myApp.controller('secondController', ['$scope', '$log', function($scope, $log) {
    
        $scope.name = 'Second';
        
        // add 'second' property to the $log object
        $log.second = 'Property from second';
        $log.log($log);

    }]);
```

When the browser hits Main, {main: 'Property from main'} is added to $log object and logged to the browser console.  When we hit Second, {second: 'Property from second'} is added to $log object and BOTH print to browser console!  Because $log is one and the same object - a singleton.

**So what about $scope?**  $scope is an exception to the service singleton rule.  All services inherit from what's called the **rootScope**.  Certain circumstances, like passing it to a controller, cause a new **child scope** to created.

When we create our own services, we create singletons - a piece of functionality or data that can be shared across pages in a SPA.