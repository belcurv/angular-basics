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