const User = require('../models/User');
const bcrypt = require('bcrypt');


async function createUser(req, res) {
const { username, password, fullName, role, contactNumber, email } = req.body;
const hash = await bcrypt.hash(password, 10);
const u = new User({ username, passwordHash: hash, fullName, role, contactNumber, email });
await u.save();
res.status(201).json({ message: 'User created', user: { id: u._id, username: u.username } });
}


async function listUsers(req, res) {
const users = await User.find().select('-passwordHash');
res.json(users);
}


module.exports = { createUser, listUsers };