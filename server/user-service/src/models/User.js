const mongoose = require('mongoose');
const mongooseFuzzySearching = require('@rowboat/mongoose-fuzzy-searching');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'researcher', 'public'], default: 'public' },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    profilePictureUrl: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

userSchema.plugin(mongooseFuzzySearching, { fields: ['username', 'name', 'email'] });

// Method to check the entered password against the hashed one
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
