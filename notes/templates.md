## Templates

The template property in our directive has gotten pretty large and unmanageable:

```javascript
myApp.directive('searchResult', function() {
    return {
        restrict: '',
        template: '<a href="#" class="list-group-item"><h4 class="list-group-item-heading">Doe, John</h4><p class="list-group-item-text">555 Main St., New York NY 1111</p></a>',
        replace: true
    }
});
```

Angular gives us a simple solution to this.  Instead of the above `template' property, we define a property `templateUrl`:

```javascript
myApp.directive('searchResult', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/searchresults.html',
        replace: true
    }
});
```

The idea above is that we point the directive to a separate template, in this case one stored at `/directives/searchresults.html`.  And in that template file is simply the HTML:

```
<a href="#" class="list-group-item">
    <h4 class="list-group-item-heading">Doe, John</h4>
    <p class="list-group-item-text">
        555 Main St., New York NY 1111
    </p>
</a>
```