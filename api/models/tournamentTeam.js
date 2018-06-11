'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('TournamentTeam', {
        name      : {type: DataTypes.STRING, allowNull: false, unique: true},
        flag      : DataTypes.STRING,
        group      : DataTypes.STRING,
        groupPos   : DataTypes.INTEGER
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};