'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('TournamentMatch', {
        matchId   : {type: DataTypes.INTEGER, allowNull: false},
        homeTeam  : {type: DataTypes.STRING, allowNull: false},
        awayTeam  : {type: DataTypes.STRING, allowNull: false},
        date      : {type: DataTypes.DATE, allowNull: false}
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};