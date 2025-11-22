const Violation = require('../models/Violation');
const Offender = require('../models/Offender');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

async function createViolation(req, res) {
  try {
    const {
      offenderId,
      firstName, lastName, address, age, gender, contactNumber,
      violationType, violationDescription, location, reportingOfficer, dateOfViolation
    } = req.body;

    let offender;
    if (offenderId) {
      offender = await Offender.findById(offenderId);
      if (!offender) return res.status(404).json({ message: 'Offender not found' });
    } else {
      offender = new Offender({ firstName, lastName, address, age, gender, contactNumber });
      await offender.save();
    }

    const v = new Violation({
      offenderId: offender._id,
      offenderSnapshot: { fullName: offender.fullName, address: offender.address, contactNumber: offender.contactNumber },
      violationType,
      violationDescription,
      location,
      reportingOfficer,
      dateOfViolation: dateOfViolation ? new Date(dateOfViolation) : new Date(),
      createdBy: req.user._id
    });
    await v.save();

    offender.violationCount = (offender.violationCount || 0) + 1;
    await offender.save();

    await AuditLog.create({ userId: req.user._id, action: 'create_violation', targetCollection: 'violations', targetId: v._id, details: { violationType }, ip: req.ip });

    // optional: create notification for repeat offender (threshold=3)
    if (offender.violationCount >= 3) {
      // create notification document or emit socket event (not implemented here)
      console.log('Repeat offender:', offender.fullName);
    }

    res.status(201).json({ message: 'Violation recorded', violation: v });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function listViolations(req, res) {
  try {
    const { page = 1, limit = 20, violationType, offenderName, dateFrom, dateTo } = req.query;
    const filter = {};
    if (violationType) filter.violationType = violationType;
    if (dateFrom || dateTo) filter.dateOfViolation = {};
    if (dateFrom) filter.dateOfViolation.$gte = new Date(dateFrom);
    if (dateTo) filter.dateOfViolation.$lte = new Date(dateTo);

    if (offenderName) {
      const offenders = await Offender.find({ fullName: { $regex: offenderName, $options: 'i' } }).select('_id');
      const ids = offenders.map(o => o._id);
      filter.offenderId = { $in: ids.length ? ids : [mongoose.Types.ObjectId('000000000000000000000000')] };
    }

    const q = Violation.find(filter).sort({ dateOfViolation: -1 })
      .skip((page-1)*limit).limit(parseInt(limit)).populate('offenderId', 'firstName lastName fullName');

    const [items, total] = await Promise.all([q.exec(), Violation.countDocuments(filter)]);
    res.json({ items, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createViolation, listViolations };