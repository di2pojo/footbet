const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'TournamentTemplate', required: true }
});

module.exports = mongoose.model('Tournament', tournamentSchema);