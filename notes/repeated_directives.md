## Repeated Directives

Once you have a directive defined and working you can use it in all sorts of scenarios.  Modifying our example to take an array of people:

```javascript
myApp.controller('mainController', ['$scope', '$log', function($scope, $log) {

    $scope.people = [
    {
        name: 'John Doe',
        address: '555 Main St.',
        city: 'New York',
        state: 'NY',
        zip: '11111'
    },
    {
        name: 'Jane Doe',
        address: '333 Second St.',
        city: 'Buffalo',
        state: 'NY',
        zip: '2222'
    },
    {
        name: 'George Doe',
        address: '111 Third St.',
        city: 'Miami',
        state: 'FL',
        zip: '33333'
    }
    ];
    
    $scope.formattedAddress = function(person) {
    
        return person.address + ', ' + person.city + ', ' + person.state + ' ' + person.zip;
        
    };
    
}]);
```

Then we can loop over that array of people:

```
<label>Search</label>
<input type="text" ng-model="Doe" />

<h3>Search Results:</h3>
<div class="list-group" ng-repeat="person in people">
    <search-result person-object="person" formatted-address-function="formattedAddress(aperson)" ng-repeat="person in people"></search-result>
</div>
```

The above uses a default Angular directive (ng-repeat) on one of our custom directives (search-result).
