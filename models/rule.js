/*
 * /models/rule.js
 * Purpose: database model used by db.js.
*/

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rule', {
        RuleName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,250],
                isString: function (value) {
                    if (typeof value !== 'string') {
                        throw new Error('Rule name must be a string!');
                    }
                }
            }
        }
    });
};