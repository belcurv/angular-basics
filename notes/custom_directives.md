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

