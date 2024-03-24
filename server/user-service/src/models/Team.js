const mongoose = require('mongoose');
const mongooseFuzzySearching = require('@rowboat/mongoose-fuzzy-searching');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

teamSchema.plugin(mongooseFuzzySearching, { fields: ['name'] });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
