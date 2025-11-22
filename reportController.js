const Violation = require('../models/Violation');

async function summaryReport(req, res) {
  const { from, to } = req.query;
  const dateFrom = from ? new Date(from) : new Date('1970-01-01');
  const dateTo = to ? new Date(to) : new Date();

  const total = await Violation.countDocuments({ dateOfViolation: { $gte: dateFrom, $lte: dateTo } });

  const byType = await Violation.aggregate([
    { $match: { dateOfViolation: { $gte: dateFrom, $lte: dateTo } } },
    { $group: { _id: '$violationType', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const topOffenders = await Violation.aggregate([
    { $match: { dateOfViolation: { $gte: dateFrom, $lte: dateTo } } },
    { $group: { _id: '$offenderId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({ total, byType, topOffenders });
}

module.exports = { summaryReport };