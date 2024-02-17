const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, //user
    password: { type: String, required: true }, //password
    full_name: { type: String },
    date_of_birth: { type: Date },
    email: { type: String }
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

// Method to check the entered password against the hashed one
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
