const mongoose = require('mongoose');

const matchTemplateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    matchNumber: { type: Number, required: true },
    matchType: { type: String, enum: ['GROUP', 'KNOCKOUT'], required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true }
});

module.exports = mongoose.model('MatchTemplate', matchTemplateSchema);