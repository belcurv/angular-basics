## Understanding 'Compile' and 'Link'

When building code, the _compiler_ converts code to a lower-level language, then the _linker_ generates a file that the computer will actually interact with.  These are comp sci terms unfamiliar to many web developers, and **not what AngularJS does anyway**.

The AngularJS developers chose to use these terms to describe aspects of custom directives becuase they're _kind of_ similar theoretically, but not really.

Recal that we have this in our main.html view:

```
<h3>Search Results:</h3>
<div class="list-group">
    <search-result person-object="person" formatted-address-function="formattedAddress(aperson)" ng-repeat="person in people"></search-result>
</div>
```

It's a search-result directive, inside an ng-repeat, so that every item in the people array is passed as an object (person) into the newly created directive (formatted-address-function), which outputs some HTML (seachresult.html) using that object, and it's all set up using an array in mainController via a directive (searchResult).

So what do 'compile' and 'link' do?  Inside the object that defines our directive, we can add a new property: `compile`.  `compile` takes as its value a function that expects two paramters: `elem` and `attrs`.  And then we can have code inside the function to do whatever we want.  And then the compile function returns and object, which can have two properties: `pre` (or: pre-link) and `post` (or post-link).  Pre and Post both get functions.

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
        compile: function(elem, attrs) {
        
            console.log('Compiling...');
            console.log(elem.html);
            
            return {
            
                pre: function(scope, elements, attrs) {
                
                    console.log('Pre-linking...');
                    console.log(elements);
                    
                },
                
                post: function(scope, elements, attrs) {
                
                    console.log('Post-linking...');
                    console.log(elements);
                
                }
            }
            
        }
    }
});
```

When we `compile` we gain access to the HTML that defines the view for the directive.  We can change a directive on the fly, before it gets used.  We could, for example, remove the class attribute on the fly:

```javascript
...
compile: function(elem, attrs) {

    console.log('Compiling...');
    elem.removeAttr('class');   // mod view on the fly!
    console.log(elem.html);

    return {
    ...
```

So what's link doing?  Compile gives us one chance to change the directive itself.  Link lets us make changes each time the directive is used.  Note that pre-link runs, then post-link runs.  Three times.  Because we have 3 objects inside the people array.  The linking functions let me access and change the HTML as each directive is created along the way.  **Angular actually says NOT to use pre-link** in their own documentation.  Post-link is safer because it works only after Angular has figured out / rendered the DOM stuff.  So we'll just look at post-link:

```javascript
compile: function(elem, attrs) {

    console.log('Compiling...');
    console.log(elem.html);

    return {

        post: function(scope, elements, attrs) {

            console.log('Post-linking...');
            console.log(elements);

        }
    }

}
```

What can we do with it?  The post function gets the view template (elements) as well as any attributes (attrs) and it also gets the model (scope) for that particular instance of the directive - the thing that's about to be output as HTML.  We can do the same thing as above slightly differently: remove a class conditionally:

```javascript
compile: function(elem, attrs) {

    console.log('Compiling...');
    console.log(elem.html);

    return {

        post: function(scope, elements, attrs) {

            console.log('Post-linking...');
            console.log(scope);   // output scope object to console

            if (scope.personObject.name == 'Jane Doe') {
                elements.removeAttr('class');
            }

            console.log(elements);

        }
    }

}
```

When would we ever want to do this?  When tasks we need to do require code - it can't just be done inside the directive itself.  Suppose we needed to add our own listeners or make decisions based on data coming back from a database.  AngularJS gives us the tools to do this with post links.

Now, we'll almost never have to run code inside _compile_.  Because it's a pain to have to always write an empty _compile_ just to return a _post link_, AngularJS provides a shorthand: `link`:

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
        link: function(scope, elements, attrs) {

            console.log('linking...');
            console.log(scope);   // output scope object to console

            if (scope.personObject.name == 'Jane Doe') {
                elements.removeAttr('class');
            }

            console.log(elements);

        }
    }
});
```

That `link` is what developers normally do.  It's shorthand for an empty compile with a post link.