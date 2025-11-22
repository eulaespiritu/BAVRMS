const mongoose = require('mongoose');
const { Schema } = mongoose;


const offenderSchema = new Schema({
firstName: String,
lastName: String,
fullName: { type: String, index: true },
address: String,
age: Number,
gender: String,
contactNumber: String,
remarks: String,
violationCount: { type: Number, default: 0 }
}, { timestamps: true });


offenderSchema.pre('save', function(next){
this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
next();
});


module.exports = mongoose.model('Offender', offenderSchema);