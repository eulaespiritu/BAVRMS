const mongoose = require('mongoose');
const { Schema } = mongoose;


const auditSchema = new Schema({
userId: { type: Schema.Types.ObjectId, ref: 'User' },
action: String,
targetCollection: String,
targetId: Schema.Types.ObjectId,
details: Schema.Types.Mixed,
ip: String
}, { timestamps: true });


module.exports = mongoose.model('AuditLog', auditSchema);