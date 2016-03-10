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

