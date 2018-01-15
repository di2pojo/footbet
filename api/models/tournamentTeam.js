const mongoose = require('mongoose');

const tournamentTeamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    groupPos: { type: String, required: true }
});

module.exports = mongoose.model('TournamentTeam', tournamentTeamSchema);