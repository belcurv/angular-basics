## Requirements

Home page with a form.  Type in my city, click submit.  Takes me to a forecast page which will list the weather forecast for my city for the next 2, 5, or 7 days (user selectable).

##A Custom Service

We need to share some data between the home page and the forecast page.  We need to bind the textbox to our scope and share it.  We do this with a custom service.

## Open Weather Map

Going to use App ID: b1b15e88fa797225412429c1c50c122a

This returns values in XML, in metric units.

http://api.openweathermap.org/data/2.5/forecast/daily?q=London&mode=xml&units=metric&cnt=7&appid=b1b15e88fa797225412429c1c50c122a

We want JSON and without units (defaults to kelvin), so we remove the mode and units query strings:

http://api.openweathermap.org/data/2.5/forecast/daily?q=London&cnt=2&appid=b1b15e88fa797225412429c1c50c122a

The JSON results have a city name, a count (the number of days of results), and a 'list' property which is an array.  Within it is the date ('dt') and the daytime temp ('temp.day').

## ngResource for getting data from the internet

The resource service wraps up the http service that comes with Angular.  It makes it easier to go out and get data.  We want to get this data in our forecast controller.

Ok.  $resource takes the base URL plus two objects (see below).  The objects basically tell angular that it's OK to communicate with this third party resource using .get.  Then, we invoke weatherAPI.get, passing in the three required parameters (city name, count & app ID), and store the result as $scope.weatherResult.

```javascript
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {
        callback: "JSON_CALLBACK" }, { get: {method: "JSONP" }});
    
    $scope.weatherResult = $scope.weatherAPI.get(
        {
            q: $scope.city,
            cnt: 2,
            appid: b1b15e88fa797225412429c1c50c122a
        }
    );
```

## Now we need to output to the page

The above gives us an object: weatherResult.  It contains everything we previously saw by just browsing to:

http://api.openweathermap.org/data/2.5/forecast/daily?q=London&mode=xml&units=metric&cnt=7&appid=b1b15e88fa797225412429c1c50c122a

We need to pick a few values from the object to display in our view.  We use ng-repeat to iterate through all the items inside weatherResult.list (see above for why we want list).

```
<div ng-repeat="w in weatherResult.list">
    <h3>{{ w.dt }}</h3>
    <p>Daytime temperature: {{ w.temp.day }}</p>
```

Remember, `w` is the DOM-ishh variable for each element we're looping through, `dt` is the property name for 'date' in our weatherResult object, and temp.day is the property name for daytime temp in our weatherResult object.

## Formatting output

We're going to convert the kelvin temps to F.  Tony does this in the controller with a convertToFarenheit method.  Then we can call the function right inside the view/template interpolated {{ }} deal:

```
    <div class="panel-body">
        Daytime temperature: {{ convertToFarenheit(w.temp.day) }} deg F.
    </div>
```

He does the same with the dates...  Except, the number that comes back from the API isn't quite right as far as a direct conversion into dates, because it's in miliseconds.  So we have to multiply by 1000.

```javascript
$scope.convertToDate = function (dt) {

    return new Date(dt * 1000);

};
```

## Changing the number of days displayed

The last part of our functionality is changing the number of days displayed.  We want to be able to pass it as a paramter.  Tony does this with a new route:

```javascript
.when('/forecast/:days', {
    templateUrl: 'pages/forecast.html',
    controller : 'forecastController'
});
```

The `/:days` bit becomes a new variable we can use.  We gain access to it using the $routeParams service in our forecastController.  Then we declare a new variable on $scope and pass it the route parameter _if there is one_, if not defaults to 2.

`$scope.days = $routeParams.days || '2';`

Why is 2 a string?  See below re: ng-class.

Then we pass $scope.days to the weather API instead of a fixed `cnt`:

```javascript
    $scope.weatherResult = $scope.weatherAPI.get(
        {
            q: $scope.city,
            cnt: $scope.days,
            appid: b1b15e88fa797225412429c1c50c122a
        }
    );
```

Then we need to add a selector to change the number of days.  We add this to the top of forecast.html:

```
Days: <a href="#/forecast/2" ng-class="{ 'bg-primary': days === '2' }">2</a>
    | <a href="#/forecast/5" ng-class="{ 'bg-primary': days === '5' }">5</a>
    | <a href="#/forecast/7" ng-class="{ 'bg-primary': days === '7' }">7</a>
```

Note that we're checking to see if `days` is equal to a number passed in via routeParams.  But, it's not a javascript number - **route paramters come as strings**.  Hence we need the 'quotes' around the numbers.

## A Custom Directive

Let's make output of our date and daytime temperature into a custom directive.  In our  forecast.html template, inside the ng-repeat area, we have this sequence of nested panel divs:

```
<div class="row">
    <div class="col-md-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">{{ convertToDate(w.dt) | date: 'MMM d, y' }}</h3>
            </div>
            <div class="panel-body">
                Daytime temperature: {{ convertToFarenheit(w.temp.day) }} deg F.
            </div>
        </div>
    </div>
</div>
```

Let's take the area where the panel starts and make it a custom directive.

Step 1: add the directive to our Angular app:

```javascript
weatherApp.directive('weatherPanel', function () {
    return {
        restrict: 'AE',  // restrict to attributes & elements
        templateUrl: 'directives/weatherpanel.html',
        replace: true
    }
});
```

Step 2: create the template: `directives/weatherpanel.html`:

```
<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">{{ convertToDate(w.dt) | date: 'MMM d, y' }}</h3>
    </div>
    <div class="panel-body">
        Daytime temperature: {{ convertToFarenheit(w.temp.day) }} deg F.
    </div>
</div>
```

Step 3: modify the forecast.html template to refer to the directive:

```
<div class="row">
    <div class="col-md-12">
        <weather-panel></weather-panel>
    </div>
</div>
```

That's it!  Or is it?  Let's isolate the directive's scope.

We have this object `w` that contains the date and the list of temperatures.  We'll need to pass that object to our custom directive.  We also have 2 functions from forecastController.  And let's also abstract the date formatting feature into another thing.  We poke holes in the isolated scope by using attributes on the directive:

Define the isolated scope object:

```javascript
weatherApp.directive('weatherPanel', function () {
    return {
        restrict: 'AE',  // restrict to attributes & elements
        templateUrl: 'directives/weatherpanel.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToStandard: '&',
            convertToDate: '&',
            dateFormat: '@'
        }
    }
});
```

And pass those things through our poked holes:

```
<div ng-repeat="w in weatherResult.list">
    <div class="row">
        <div class="col-md-12">
            <weather-panel weather-day="w"
                           convert-to-standard="convertToFarenheit(dayTimeTemp)"
                           convert-to-date="convertToDate(dt)"
                           date-format="MMM d, y">
            </weather-panel>
        </div>
    </div>
</div>
```

And finally update the directive template itself.  Instead of using Angular's date filter, we pass our date-format string.  Instead of passing the convertToFarenheit method, we pass our _wrapper_ convertToStandard, which gets an object map now.  And instead of 'w' we called it weatherDay, so we pass that instead.  convertToDate gets passed an object map as well.  The object maps connect the variables we declared in forecast.html to the corresponding variables used in weatherpanel.html template:

```
<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">{{ convertToDate({ dt: weatherDay.dt }) | date: dateFormat }}</h3>
    </div>
    <div class="panel-body">
        Daytime temperature: {{ convertToStandard({ daytimeTemp: weatherDay.temp.day }) }} deg F.
    </div>
</div>
```

## One more thing...

We're starting to have a lot of code in our Angular app.js file.  We can section off components of app.js into their own files.  We do this by:

1.  Creating the new file (routes.js, for example) and
2.  Referencing the new file in our index.html file **after app.js**

We will do this for routes, services, controllers and directives.  It makes for compartmentalized, easy to understand code.

## Bonus Lecture: **ng-submit**

**ng-submit**  Currently our weather app's form requires users to click on the button.  We can't just type a city and hit enter.  Our button is actually a link `<a>` that Bootstrap styles to look like a button.  Let's convert this to a real form with a submit button.

`ng-submit` is a built in directive that takes a function.  We first wrap the form inside `<form>` tags, git the opening tag the ng-submit directive, and change the `<a>` link button to a real button:

```
<div class="row">
    <div class="col-md-6 col-md-offset-3">
        <h4>Forecast by City</h4>
        <form ng-submit="submit()">
            <div class="form-group">
                <input type="text" ng-model="city" class="form-control" />
            </div>
            <input type="submit" class="btn btn-primary" value="Get Forecast"/>
        </form>
    </div>
</div>
```

In the above, when the form is actually submitted, Angular looks for the `submit()` method on the $scope.  So let's write that function.

All we need to do in the `submit()` function is move us to the forecast page of our SPA.  In order to do that, we need another built-in service: `$location`:

```javascript
weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function ($scope, $location, cityService) {
    
    $scope.city = cityService.city;
    
    $scope.$watch('city', function () {   // watch the $scope bound textbox for changes.
        cityService.city = $scope.city;   // If it changes, update city in our service
    });
    
    $scope.submit = function () {
        $location.path('/forecast');
    }
    
}]);
```

Now when we click the button or hit enter the browser will submit the form, and the ng-submit will run the submit() method, which is on homeController's $scope, and that will navigate us to /forecast route, which loads /pages/forecast.html.

## Bonus Lecture: **services in large applications**

Ideally we want tight, lean controllers.  If a controller is just managing a few DOM/view variables, it's no big deal.  But if we're using controllers to go out and get data and manipulate it, etc., it's best to move that logic into a separate service.

For example, in our forecastController, we have code that fetches weather data from the openweather API.  We can improve this by moving it into its own service.

We can't just copy/paste the controller code into a new service - we have to include it inside a new method.  Like this:

```javascript
weatherApp.service('weatherService', function () {
    
    this.GetWeather = function (city, days) {
        var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }} );

        // using appid: b1b15e88fa797225412429c1c50c122a
        return weatherAPI.get({
            q: city,
            cnt: days,
            appid: 'b1b15e88fa797225412429c1c50c122a'
        });
    };
    
});
```

Now we have a variable (weatherAPI) using the $resource service and returning the results of getting that resource.  We strip out the $scope and pass the method 'city' and 'days' directly.

There's one more problem: $resource.  That was injected into our controller and we don't have access to it inside our service.  Except we do: we inject the service the same way we did it in the controller (pass an array).  Really powerful: we can use services inside services.

```javascript
weatherApp.service('weatherService', ['$resource', function ($resource) {
    
    // code here //
    
}]);
```

Finally, back in our controller ... we can remove the $resource service and we have to inject our new weatherService:

```javascript
weatherApp.controller('forecastController', ['$scope', '$routeParams', 'cityService', 'weatherService', function ($scope, $routeParams, cityService, weatherService) {
    
    $scope.city = cityService.city;
    
    $scope.days = $routeParams.days || '2';
    
    $scope.weatherResult = weatherService.GetWeather($scope.city, $scope.days);
    
    $scope.convertToFarenheit = function (degK) {
        
        return Math.round((1.8 * (degK - 273)) + 32);
    };
    
    $scope.convertToDate = function (dt) {
        
        return new Date(dt * 1000);
        
    };
    
}]);
```

We also set _$scope.weatherResult_ equal to our weatherService method GetWeather, passing in _$scope.city_ and _$scope.days_.
