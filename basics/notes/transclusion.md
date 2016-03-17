## Understanding Transclusion

**Transclusion:** including a copy of one ducument at a particular point inside another.

Take our directive without the link stuff:

```javascript
myApp.directive('searchResult', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/searchresult.html',
        replace: true,
        scope: {
            personObject: "=",
            formattedAddressFunction: "&"
        }            
    }
});
```
And the view code

```
<div class="list-group">
    <search-result person-object="person" formatted-address-function="formattedAddress(aperson)" ng-repeat="person in people"></search-result>
</div>
```

The directive is an element (search-result).  Say we want to put something inside of the element, like a footnote:

```
<div class="list-group">
    <search-result person-object="person" formatted-address-function="formattedAddress(aperson)" ng-repeat="person in people">
        *search results may not be valid
    </search-result>
</div>
```

That new piece of text doesn't make it into the DOM, because the `<search-result>` element is a **placeholder for the searchresult.html template**.  The template replaces the `<search-result>` element.

So how do I make this work?  That's **transclusion**, and Angular gives us a directive for this: **ng-transclude**.  It goes into the template:

```
<a href="#" class="list-group-item">
    <h4 class="list-group-item-heading"> {{ personObject.name }} </h4>
    <p class="list-group-item-text">
        {{ formattedAddressFunction({ aperson: personObject }) }}
    </p>
    <small><ng-transclude></ng-transclude></small>
</a>
```

What `<ng-transclude>` does is provide a position for other content inside your directive.  Whatever that content is, it gets rendered in between the `<ng-transclude>` tags.  Last step: enable transclusion in Angular:

```javascript
myApp.directive('searchResult', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/searchresult.html',
        replace: true,
        scope: {
            personObject: "=",
            formattedAddressFunction: "&"
        },
        transclude: true   // enable transclusion
            
    }
});
```

You can also do this is with an attribute instead of an element:


```
<a href="#" class="list-group-item">
    <h4 class="list-group-item-heading"> {{ personObject.name }} </h4>
    <p class="list-group-item-text">
        {{ formattedAddressFunction({ aperson: personObject }) }}
    </p>
    <small ng-transclude></small>
</a>
```

Summary: ng-transclude gives us a point to plop a piece of DOM data into a directive.