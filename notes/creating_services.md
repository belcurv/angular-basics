## Creating a Service

The syntax for creating our own service - that is, a singleton object that will contain properties and functions/methods - is pretty simple.

It gets attached to myApp, so we don't pollute the global namespace.  The .service method takes the services name and a function that contains all the methods and properties of the object.  To access the service inside a controller, we do it the same way we inject other services.

```javascript
myApp.service('nameService', function () {

    var self = this;
    this.name = 'John Doe';
    
    this.nameLength = function () {
    
        return self.name.length;
    
    };

});

myApp.controller('mainController', ['$scope', '$log', 'nameService', function($scope, $log, nameService) {
    
        $scope.name = 'Main';
        
        $log.log(nameService.name);
        $log.log(nameService.nameLength());

}]);
```

So what would I want to do with a service?  The cool thing is that singletons maintain variables  even through DOM state changes.  So content can be shared across pages.  Services can also encapsulate functionality across different controllers.

## Factories and Providers

This course doesn't cover them.  Factories and services are basically the same thing.  Providers we'll rarely have to use.  Normally, learning how to use services is all we'll have to use.