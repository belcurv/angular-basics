## Custom Directives

Our goal: building our own HTML reusable components.  There's an idea on the way called 'web components'. It's not here yet, but Angular gives us that functionality anyway.  The idea is, we want to replace, for example:

```
<div>
    <h1>Search Results</h1>
    <div>
        <p>
            Details
        </p>
        <a href="#">More info</a>
    </div>
    <div>
        <p>
            Details
        </p>
        <a href="#">More info</a>
    </div>
    <div>
        <p>
            Details
        </p>
        <a href="#">More info</a>
    </div>
    <div>
        <p>
            Details
        </p>
        <a href="#">More info</a>
    </div>
    <div>
        <p>
            Details
        </p>
        <a href="#">More info</a>
    </div>
</div>
```

... with our own component, say like this:

```
<searchResults></searchResults>
<searchResults></searchResults>
<searchResults></searchResults>
<searchResults></searchResults>
<searchResults></searchResults>
```

... which outputs essentially the same thing in the DOM.  We can do this, but we have to address a small problem first...

**Variable Names and Normalization**

Normalize: to make consistent to a standard.  You might have a variety of things, and you make them all consistent with a standard.  Specifically we are dealing with 'text normalization', or making different strings of text consistent with a standard.  In particular, we need to normalize our variable names.

To understand why, take this example: we'll be giving our custom directives names and attributes like:

```
<search-result result-link-href="#"></search-result>
```

The above is one standard way of doing things, and is used by HTML and CSS: all lower case, with dashes between each word.  Frameworks like bootstrap do it this way.  We'll follow this standard when creating our own components elements.

But we can't use the dashes in javascript variable names (they mean _subtract_).  **So Angular normalizes variable names into camel case**.

We change this:

```javascript
var result-link-href = '#';
```

... to this:

```javascript
var resultLinkHref = '#';
```

... **and Angular connects resultLinkHref in the model to result-link-href in the HTML template!**

Recap: Angular expects `result-link-href` in the template, and `resultLinkHref` in the model, and magically links the two together.

So when you need to grab some attribute value from the HTML, say `learn-and-understand-angular-js` and store it in a variable, you'll be typing something like this: `learnAndUnderstandAngularJs`.

## Creating a Custom Directive

Create directives on the myApp variable so as to not pollute the global namespace.  Name the directive and give it a function.  All the function does is return an object, the object is the directive.  The directive contains properties that Angular uses to define the directive.

```javascript
myApp.directive('searchResult', function() {
    return {
        template: '<a href="#" class="list-group-item"><h4 class="list-group-item-heading">Doe, John</h4><p class="list-group-item-text">555 Main St., New York NY 1111</p></a>',
        replace: true
    }
});
```

And in the view...

```
<div class="list-group">
    <search-result></search-result>
    <search-result></search-result>
    <search-result></search-result>
    <search-result></search-result>
    <search-result></search-result>
</div>
```

At a minimum, we need to specify a template.  Above, it's just a single string of HTML with all the line breaks removed.  Optionally, we can spec `replace`, which defaults to _false_.  Leaving it set to _false_ means Angular leaves the target HTML element intact - in this case, `<search-result></search-result>`.  But setting _replace: true_ replaces `<search-result></search-result>` with the template.  This is useful because `<search-result></search-result>` fucks up Bootstrap.

Alternately, instead of creating a new element to be our custom directive, we can add a new attribute to an existing element.  These are the same:

```
<search-result></search-result>
<div search-result></div>
```

Both approaches are valid and work by default in Angular.  There are two others that are not turned on by default.  We can `restrict` which approaches can be used.

```javascript
myApp.directive('searchResult', function() {
    return {
        restrict: '',
        template: '<a href="#" class="list-group-item"><h4 class="list-group-item-heading">Doe, John</h4><p class="list-group-item-text">555 Main St., New York NY 1111</p></a>',
        replace: true
    }
});
```

`restrict` takes shorthand: **A** for attribute, **E** for element.  So setting `restrict: E` means that the template willonly render if it's called as a DOM element in the view.  And you can have more than one: `restrict: AE` - this is the default.

The non-deafult values are **C** for class and **M** for comment.  These two are almost never used.

Better to use templates during directive creation:

```javscript
myApp.directive('searchResult', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/searchresults.html',
        replace: true
    }
});
```

## Angular Directives and Scope

Specifically, `@`, `=`, and other obtuse symbols.

We've seen that Angular deals with models and views and things that connect them.  For example, in our SPA we have our routes, and in our route provider we define our views (as templates) and our controllers.  And in a controller we have a model, sitting on `$scope` essentially.

So for example, let's say we add a person object to the model:

```javascript
myApp.controller('mainController', ['$scope', '$log', function($scope, $log) {

    $scope.person = {
        name: 'John Doe',
        address: '555 Main St., New York NY 11111'
    };

}]);
```

Then in main.html (because that's the view connected to this controller via our routing), we have our directives sitting there.

```
<h3>Search Results:</h3>
<div class="list-group">
    <search-result></search-result>
</div>
```

What happens inside the search-result directive when it comes to the model?  The directive is part of the `main.html` template, so by default, the directive has access to anything in the model for the template that contains that directive.  in other words, the model for the directive is the same as the model for the html template that contains the directive.

In our example above, since `mainController` contains a model sitting on `$scope`, we can used that object inside our `searchresults.html` directive.

Instead of:

```
<a href="#" class="list-group-item">
    <h4 class="list-group-item-heading">Doe, John</h4>
    <p class="list-group-item-text">
        555 Main St., New York NY 11111
    </p>
</a>
```

... we can access the object and its properties in the directive:

```
<a href="#" class="list-group-item">
    <h4 class="list-group-item-heading"> {{ person.name }} </h4>
    <p class="list-group-item-text">
        {{ person.address }}
    </p>
</a>
```

Summing up: **the child directive gets access to the parent template's model**.

**This is neat, but dangerous**.  It gives too much power to a directive; the directive can affect the $scope application wide.  So Angular provides a method to isolate the model part of the directive from the model for whatever part of the page contains the directive.  This is called:

**Isolated Scope**

We add another property to the directive when we're creating it, `scope`, which is a javascript object:

```javascript
myApp.directive('searchResult', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/searchresults.html',
        replace: true,
        scope: {
            
        }
    }
});
```

The `scope: {}` property disconnects the directive from its parent's $scope/model, siging it its own model. The directive can no longer be affected by, or directly affect, its parent page.  This prevents accidental things from happening when reusing the same directive across various different pages.

So, what if we have things in the parent that we want to access in the directive?  Remember, with isolated scope our directive has its own scope.  Angular uses three attributes (symbols) to poke holes in the directive's isolated 'walled garden':

1.  `@` - the 'at' sign means "This variable is giving you text, Mr. Directive".

    If the camel cased variable is the same as the expected value, we can use the shorthand "@". Meaning: `personName: "@"` is identical to `personName: "@personName"`.
    
    But you could assign the variable to a different property name if you want: `personNameIsolated: "@personName"`, in which case you have to specify the text after the @ sign.
    
2.  `` - blah
3.  `` - blah

Say we want access to the person object we created above.  We go to the view where the directive is instantiated - in our case in _main.html_.  We add a custom attribute to the directive as it's instatiated:

```
<h3>Search Results:</h3>
<div class="list-group">
    <search-result person-name="{{ person.name }}" person-address="{{ person.address }}"></search-result>
</div>
```

That person.name comes from mainController.  Then we have to modify the directive.  The view HTML attribute gets _normalized_ in the javascript directive:

```javascript
myApp.directive('searchResult', function() {
    return {
        restrict: 'AE',
        templateUrl: 'directives/searchresults.html',
        replace: true,
        scope: {
            personName: "@",
            personAddress: "@"
        }
    }
});
```

Now, _personName_ is available in the directive's model/scope, for a specific view. Now we change the template to accept the directive's new scope properties/variables:

```
<a href="#" class="list-group-item">
    <h4 class="list-group-item-heading"> {{ personName }} </h4>
    <p class="list-group-item-text">
        {{ personAddress }}
    </p>
</a>
```

Summary: I had an object (person) in a model ($scope) on a controller (mainController) pointing to a view (main.html).  I was able to pass that object via a custom attribute (person-name) in the view to my directive (searchResult).  And in the directive's isolated scope, we add a property (personName) that expects that object as text ("@").  And now we use the directive's scope variable personName in the directive's template.