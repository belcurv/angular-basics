## Single Page Applications

Where a browser only downloads the whole shebang once.  And then we use AJAX behind the scenes using the hash.

**Single Page Apps and the Hash**

Example hash: #bookmark.  That's called a **fragment identifier**.  Been around for a long time.  We can do something interesting with it.

Javascript has a native event listener: _hashchange_

```javascript
window.addEventListener('hashchange', function () {

    console.log('Hash Changed!: ' + window.location.hash);

});
```

When we click on #bookmark, the event listener sees the hash change and fires a callback.

You don't even need a real anchor on the page for this to work.  We can put whatever we want into the has value / fragment identifier:

    localhost:3000/index.html#/bookmark
    localhost:3000/index.html#/boogermark
    localhost:3000/index.html#/bookburners

Those are just strings - we can even extend this to appear like a folder hierarchy:

    localhost:3000/index.html#/bookmark/2
    localhost:3000/index.html#/bookmark/3

It's not really a folder hierarchy, but we can pretend that it means something.  And we can work with this:

```javascript
window.addEventListener('hashchange', function () {

    if (window.location.hash === '#/bookmark/1) {
        console.log('Page 1 is cool.');
    }
    
    if (window.location.hash === '#/bookmark/2) {
        console.log('Let me go get Page 2.');
    }
    
    if (window.location.hash === '#/bookmark/3) {
        console.log('Here\'s page 3.');
    }

});
```

We're mimicing what a normal URL does.  From the browser's perspective, you're not telling it to go out and actually get stuff, becuase the anchor doesn't exist.  But from a javascript perspective, I can look at the value of a hash and do whatever I want.


## Routing, Templates and Controllers

