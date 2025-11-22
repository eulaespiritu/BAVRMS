require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { connect } = require('../config/db');

(async function seed(){
  try {
    await connect(process.env.MONGO_URL || 'mongodb://localhost:27017/bvms');
    const pw = process.env.SEED_ADMIN_PASS || 'admin123';
    const hash = await bcrypt.hash(pw, 10);
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const admin = new User({ username: 'admin', passwordHash: hash, fullName: 'Barangay Captain', role: 'admin' });
    await admin.save();
    console.log('Seeded admin account (username=admin)');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();