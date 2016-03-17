## angular-basics

Purpose: Just a repository of notes and code used throughout the Udemy Learn and Understand AngularJS course.  The course doesn't include a server/API/back-end, so I wrote one with Node/Express/SQlite.

If you clone this, you can wipe your database by adding { force: true } to the end of server.js:

```javascript
// ================== START SERVER ====================
db.sequelize.sync({ force: true }).then(function () {
    app.listen(port, function () {
        console.log('Server listening on port ' + port);
    });
});

```

See the notes folder for ... more notes!
