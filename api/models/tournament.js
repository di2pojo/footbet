const mongoose = require('mongoose');

const tournamentTemplateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    template: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TournamentTemplate', required: true }]
});

module.exports = mongoose.model('TournamentTemplate', tournamentTemplateSchema);