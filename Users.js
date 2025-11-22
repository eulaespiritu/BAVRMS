const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
username: { type: String, required: true, unique: true, index: true },
passwordHash: { type: String, required: true },
fullName: String,
role: { type: String, enum: ['admin','captain','secretary','clerk'], required: true },
contactNumber: String,
email: String,
active: { type: Boolean, default: true },
lastLogin: Date
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);