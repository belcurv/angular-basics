/*
 * server.js
 * Purpose: A simple backend to play with an Angular frontent
*/

// ================================== SETUP ===================================
var express    = require('express'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
//    methodOverride = require('method-override'),
    path       = require('path'),
    db         = require('./db.js'),
    app        = express(),
    port       = process.env.PORT || 3000;


// ============================== CONFIGURATION ===============================
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ 'extended' : 'true' }));
app.use(bodyParser.json());
// app.use(methodOverride());


// ================================ API ROUTES ================================

// GET them all
app.get('/api', function (req, res) {
    // just send back all the rules
    db.rule.findAll()
        .then(function (rules) {
            res.json(rules);
        }, function (err) {
            res.status(500).send();
        });
});

// POST a new rule
app.post('/api', function (req, res) {
    // Postman needs type: JSON(application/json)
    var body = req.body;
    
    db.rule.create({
        RuleName: req.body.RuleName
    }).then(function () {
        // on success, fetch all rules
        db.rule.findAll()
            .then(function (rules) {
                res.json(rules);
            }, function (err) {
                res.status(500).send();
            });
    }, function (err) {
        res.status(400).json(err);
    });
});

// DELETE a rule
app.delete('/api/:id', function (req, res) {
    var ruleId = parseInt(req.params.id, 10);
    
    db.rule.destroy({
        where: { id: ruleId }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({ error: 'No rule with that id' });
        } else {
            res.status(204).send();  // 204 = "all good, nothing to send back"
        }
    }, function () {
        res.status(500).send();
    });
});


// ============================ APPLICATION ROUTES ============================
app.get('*', function (req, res) {
    // serve the view - Angular handles front-end 
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// =============================== START SERVER ===============================
db.sequelize.sync({ }).then(function () {     // optional db reset= force: true
    app.listen(port, function () {
        console.log('Server listening on port ' + port);
    });
});