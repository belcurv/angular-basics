What problem is Angular trying to solve?  Look at example jQuery:

    $(document).ready(function() {

        var currentStep = 0;

        $("#step1").hide();
        $("#step2").hide();

        $("#btnStep1").click(function () {

            $("#step1").show();
            $("#step2").hide();

            // update the database...
            currentStep = 1;
        });

        $("#btnStep2").click(function () {

            $("#step1").hide();
            $("#step2").show();

            currentStep = 2;
            // update the database...
        });
    });
    
That doesn't look too bad, but what it there were 20 steps?  Or special business logic?  The problem is we spend a ton of time tracking DOM elements, js variables, and manipulating the DOM.  After a while this gets overwhelming to maintain.

**DOM: the representation of the HTML that sits in the browser's memory**

Angular is a framework that tries to solve this problem: manually maintaining the business logic, the DOM, and the variables & data.

---

## Model, View, Whatever (MV*)

How to make one side (data) affect the other (html)?

The model is your data, the view is the DOM presented to the user.  The whatever is that which binds those two together.  Whatever happens in the model automatically affects the view, and whatever happens in the view automatically affects the view.

---

## HTML Aside

**Custom Attributes**

HTML5 compliance requires data- prefixes on custom attributes.  So, ng-repeat should actually be data-ng-repeat.

## Javascript Aside

**The Global Namespace**

Don't pollute the gloabl namespace.  Namespace everything!  Or stick everything in containers.  for example, instead of:

    var person = 'Steve';

    function logPerson () {
        console.log(person);
    };

You should put it all inside an object:

    var stevesApp = {};

    stevesApp.person = 'Steve';

    stevesApp.logPerson = function() {
        console.log(stevesApp.person);
    };

Always use dots!  Sticking vars inside objects removes them from the gloabl namespace.  They're encapsulated within the stevesApp namespace.

Angular only ever puts one variable into the global namspace: the app itself.

---

## Modules, Apps and Controllers

Only a single variable added to global namespace: the app itself:

    var myApp = angular.module('myApp', []);

In the above, 'angular' is an object inside angular.js.  The method .module is a function that takes two arguments:
1) the app's name
2) an array of module dependencies

The name passed to the array is what angular looks for in the DOM view html.
In this case, angular looks for 'myApp' via the custom attribute ng-app="myApp".

Now, everything else we add gets added to the myApp object.

Like a controller.  Again, angular looks for the custom attribute inside the DOM:

    ng-controller="mainController"

## Dependency Injection

Defined: giving a function an object. Rather than creating an object inside a function, you pass it to the function.

Instead of this:

    var Person = function(firstname, lastname) {
        this.firstname = firstname;
        this.lastname  = lastname;
    };

    function logPerson() {
        var john = new Person('John', 'Doe');
        console.log(john);
    };
    
    logPerson();

You pull 'john' out of the logPerson function like this:

    var Person = function(firstname, lastname) {
        this.firstname = firstname;
        this.lastname  = lastname;
    };

    function logPerson(person) {
        console.log(person);
    };

    var john = new Person('John', 'Doe');
    logPerson(john);

Why? In the first example, the function logPerson is dependent upon the variable 'john'.  If something were to change about 'john' you'd have to change it inside the function.  That makes code difficult to deal with.  So instead we inject dependencies.

In the 2nd example, logPerson doesn't care how 'john' is created, it just needs a person; it's no longer dependent upon a specific variable.

## The Scope Service

All Angular services start with a $.  **$scope is a core Angular service and an object.**  We can add variables and functions to the $scope object:
All Angular services start with a $.  **$scope is a core Angular service and an object.**  We can add variables and functions to the $scope object:

    $scope.name = 'Jay';
    $scope.occupation = 'Coder';
    $scope.getname = function () { };

$scope binds the controller to the view.  $scope defines the data that will go back & forth between the two.

$scope is passed to the controller function:

    myApp.controller('mainController', function ($scope) {
        // code
    });

**$scope seems amazing - How does it work?**

Angular has an .injector method and can parse arguments as strings.  Furthermore, it's .annotate method stores them in an array:

    var searchPeople = function (firstname, lastname, height, age, occupation) {
        // blah
        return 'Jane Doe';
    };

    console.log(angular.injector().annotate(searchPeople));

Outputs: ``["firstname", "lastname", "height", "age", "occupation"]``

Now, if $scope happens to be one of those arguments, angular parses it, and recognizes it as special.  Wherever angular sees $scope, it creates and injects a $scope object:

    var searchPeople = function ($scope, lastname, height, age, occupation) {
        // blah
        return 'Jane Doe';
    };

    console.log(angular.injector().annotate(searchPeople));
    
Outputs: ``["$scope", "lastname", "height", "age", "occupation"]``

## Getting Other Services

There's a whole ecosystem of services (other code) available by injecting it into our controllers.  It's injectable; not dependent upon how it was created.

**What comes with Angular itself?**

See [Angular.js API reference](https://docs.angularjs.org/api); scroll down to services.

For example, the $http service.  Or $log:

```
    myApp.controller('mainController', function ($scope, $log) {
        $log.log('Hello');
        $log.info("This is some information");
        $log.warn("Warning!");
        $log.debug("Some debug information");
        $log.error("This was an error!");
    };
```

More services are available from the Angular distrbution sources.  You can find the in the download section at angularjs.org.  For example, the 1.5.0 branch is [here](https://code.angularjs.org/1.5.0/).

You'll see all kinds of files.  For example, angular-messages.js, which provides some quick and easy form validation.  Copy it's URL into a new <script> tag, and that service is available to us. But not immediately.  First, we have to find the module's name (above is ngMessages).  The module name is inside the javascript.  The module is injected into the main angular.module array:

`` var myApp = angular.module('myApp', ['inject here']); ``

For example:

    var myApp = angular.module('myApp', ['ngMessages']);

Now that the module is injected, we can use it in our view:

```
    <form name="myForm">
        <label>
            Enter text:
            <input type="text" ng-model="field" name="myField" required minlength="5" />
        </label>
        <div ng-messages="myForm.myField.$error" role="alert">
            <div class="alert alert-danger" ng-message="required">You did not enter a field</div>
            <div class="alert alert-danger" ng-message="minlength, maxlength">
                Your email must be between 5 and 100 characters long
            </div>
        </div>
    </form>
```

Or angular-resource.js (module name: ngResource).  The ngResource module gives us a new service, $resource.  The module is injected into the app module array, and the service is injected into the controller:

```
    var myApp = angular.module('myApp', ['ngMessages', 'ngResource']);

    myApp.controller('mainController', function ($scope, $log, $filter, $resource) {
        // code here
    });
```

## Arrays and Functions

Javascript arrays are a little strange - you can mix types inside arrays.  For example, you can have strings and numbers:

    var things = [1, '2', 3];

Can also put functions inside arrays:

    var things = [1, '2', function() {
        alert('Hello!');
    }];

You can call the function thusly:

    var things = [1, '2', function() {
        alert('Hello!');
    }];
    
    things[2]();

## Dependency Injection and Minification

A minifier will remove whitespace and line breaks, and replace variable names with single-letters.  This can break Angular's dependency injection.  Example:


```
    myApp.controller('mainController', function ($scope, $log) {

        $log.info($scope);

    });
```

Becomes...

```
    myApp.controller('mainController',function(a,b){b.info(a)});
```

Which breaks Angular because 'a' and 'b' are not defined Angular.  So, there's another way to inject dependencies.  Should use this method.  Pass an ARRAY:

```
    myApp.controller('mainController', ['$scope', '$log', function ($scope, $log) {

        $log.info($scope);

    }]);
```

The last element in the array should always be the function that defines the array, and whatever comes before should be whatever paramters are supposed to get passed to the function.

This works because javascript arrays can contain multiple different types, and **a minifier will never change the contents of a string**.  Minifying the above results in:

```
    myApp.controller('mainController',["$scope","$log",function(a,b){b.info(a)}]);
```

The function arguments became a and b, but that's ok because they just get $scope and $log, **in that order**.  The order is critical when using this array injection method.  The paramters injected in the array have to be the same parameters in the same order in the function.

## Scope and Interpolation

Interpolation: creating a string by combining strings and placeholders.  'My name is' + name is interpolated, and results in 'My name is Tony', for example.

In jQuery, our app would have to find the correct html element, adjust the innerHtml or innerText, etc. and manually change it.

In angular we can use {{ variable }} in combination with $scope.variable

## The Event Loop

With jQuery or raw javascript, you're manually attaching code to events and waiting for them to occur (by adding listeners to the always-running javascript event loop).  For example, using raw javascript, this listens for keypresses in a textbox with the id "name":

```
    var tb = document.getElementById("name");
    
    tb.addEventListener("keypress", function(event) {
        console.log("Pressed!");
    });
```

The textbox throws an event, and because app.js is listening for it, it logs "Pressed!" for every keypress.

AngularJS takes advantage of those events to keep track of things for you:

## Watchers and the Digest Loop

This is specific to how Angular binds the model to the view.  Angular adds listeners for you, extending the event loop.  The event loop is native to the browser.  Angular adds on the **Angular Context**: everything we've built in our app that conforms to the AngularJS architecture.  Attaching variables to $scope and placing them on a page, Angular automatically adds **watchers** to a watch list.  It tracks the old value and the new value, checking for changes.

Angular has its own loop: the Digest Loop.  It goes through everythig in the watch list and asks, "has anything changed"?  If something has, it updates that thing everywhere it's affected in the model and views.

The digest loop is the reason why ng-model can "real-time" update the DOM as text gets added to an input.  The digest loop cycles for each letter keypress and updates the watchlist, and thus also updates the DOM.  This is what glues the view to the model.  It's what makes AngularJS so powerful and allows us to make interactive websites so quickly.

Again, this only applies within the Angular context.  Here's code that will not start a digest loop:


```
    setTimeout(function() {
        $scope.handle = 'newtwitterhandle';
        console.log('Scope changed!');
    }, 3000);
```

That **will** log 'Scope changed!' to the console, but it won't update the DOM because Angular isn't watching setTimeout.  We have to manually add it to the digest loop.  To do this, we use $scope.$apply.  Meaning, apply what I'm about to put in here to the Angular context.  You pass $apply a function and whatever you want to do inside the function 

```
    setTimeout(function() {
    
        $scope.$apply(function() {
            $scope.handle = 'newtwitterhandle';
            console.log('Scope changed!');
        });
    
    }, 3000);
```

How do I know when to call .$apply ?  Most Angular services call $apply behind the scenes.