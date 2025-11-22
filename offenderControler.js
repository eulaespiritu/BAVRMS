const Offender = require('../models/Offender');
const AuditLog = require('../models/AuditLog');


async function createOffender(req, res) {
const data = req.body;
const off = new Offender(data);
await off.save();
await AuditLog.create({ userId: req.user._id, action: 'create_offender', targetCollection: 'offenders', targetId: off._id, details: data, ip: req.ip });
res.status(201).json({ message: 'Offender created', offender: off });
}


async function listOffenders(req, res) {
const { page = 1, limit = 20, q } = req.query;
const filter = {};
if (q) filter.fullName = { $regex: q, $options: 'i' };
const items = await Offender.find(filter).skip((page-1)*limit).limit(parseInt(limit)).sort({ fullName: 1 });
const total = await Offender.countDocuments(filter);
res.json({ items, meta: { total, page: Number(page), limit: Number(limit) } });
}


async function getOffender(req, res) {
const off = await Offender.findById(req.params.id);
if (!off) return res.status(404).json({ message: 'Not found' });
res.json(off);
}


module.exports = { createOffender, listOffenders, getOffender };