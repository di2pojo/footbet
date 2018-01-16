const mongoose = require('mongoose');

const tournamentMatchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    matchNumber: { type: Number, required: true },
    matchType: { type: String, enum: ['GROUP', 'KNOCKOUT'], required: true },
    nextMatch: { type: Number },
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }
});

module.exports = mongoose.model('TournamentMatch', tournamentMatchSchema);