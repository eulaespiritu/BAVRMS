const mongoose = require('mongoose');
const { Schema } = mongoose;


const violationSchema = new Schema({
offenderId: { type: Schema.Types.ObjectId, ref: 'Offender', required: true, index: true },
offenderSnapshot: { fullName: String, address: String, contactNumber: String },
violationType: { type: String, required: true, index: true },
violationDescription: String,
location: String,
reportingOfficer: String,
dateOfViolation: { type: Date, required: true, index: true },
status: { type: String, enum: ['recorded','under-review','resolved'], default: 'recorded' },
createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


module.exports = mongoose.model('Violation', violationSchema);