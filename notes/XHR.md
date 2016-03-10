## The XMLHTTPRequest Object

Allows us our app to fo out and get data.  We call from an API.  All browsers implement the XMLHTTPRequest object: `XMLHTTPRequest()`.

XMLHTTPRequest was invented by MS; way ahead of its time.  An object that could make internet requests on its own, as opposed to a browser doing it.  You can make HTTP requests in code and then do something with that data.  Such a good idea, it's now a standard.

Jquery and Angular have wrappers for it, but this is how it looks in the raw (assuming there's a database backend located at http://localhost:54765/api):

```javascript
// define it
var rulesrequest = new XMLHttpRequest();
rulesrequest.onreadystatechange = function () {

    $scope.$apply(function () {  // because we went out of the Angular scope
        if (rulesrequest.readyState == 4 && rulesrequest.status == 200) {
            $scope.rules = JSON.parse(rulesrequest.responseText);
        }
    });
};

// run it
rulesrequest.open("GET", "http://localhost:54765/api", true);
rulesrequest.send();
```

... and in the view ...
 
```
<ul>
    <li ng-repeat="rule in rules">
        {{rule.RuleName}}
    </li>
</ul>
```

... So, this is pretty complicated to use.  Thus the wrappers.  Angular does exactly this using the $http object/service.

## External Data and the $http Service

Getting and sending data the angular way.  Inject the service first:

```javascript
myApp.controller('mainController', ['$scope', '$filter', '$http', function($scope, $filter, $http) {...};
```

Then use it:

```javascript
$http.get('/api')
    .success(function(result) {
        $scope.rules = result;
    })
    .error(function (data, status) {
        console.log(data);
    })
```

In the above, the .get method has a few methods of its own (.success and .error).  The 'result' argument/variable becomes the receptacle for whatever data is returned.  It's a container and can be named whatever you want.

Sending data is similar.  the .post method takes a destination URI as well as the data payload in the form of an object:

```javascript
$scope.newRule = ''
$scope.addRule = function () {

    $http.post('/api', { newRule: $scope.newRule })
        .success(function (result) {
            $scope.rules = result;
            $scope.newRule = '';  // clears the input box
        })
        .error(function (data, status) {
            console.log(data);
        });
};
```
