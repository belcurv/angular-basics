/*
 * /db.js
 * Purpose: Return database connection to server.js upon request.
*/

var Sequelize = require('sequelize'),
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/udemy_angular-api.sqlite'
    });

// create empty object to receive our model
var db = {};

// import our model
db.rule = sequelize.import(__dirname + '/models/rule.js');
db.sequelize = sequelize;           // add our sequelize instance to the object
db.Sequelize = Sequelize;           // add Sequelize library to the object

// export the whole object
module.exports = db;