const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');


async function login(req, res) {
const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
user.lastLogin = new Date();
await user.save();
res.json({ token, user: { id: user._id, username: user.username, fullName: user.fullName, role: user.role } });
}


module.exports = { login };