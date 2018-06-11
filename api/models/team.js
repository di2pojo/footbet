'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Team', {
        name      : {type: DataTypes.STRING, allowNull: false, unique: true},
        flag      : DataTypes.STRING,
        type      : DataTypes.STRING,
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};