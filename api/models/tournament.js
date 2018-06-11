'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Tournament', {
        name      : {type: DataTypes.STRING, allowNull: false, unique: true},
        type      : {type: DataTypes.STRING, allowNull: false, unique: true}
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};