const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  avatar: { type: String }, // e.g., 'AM', 'JD'
  // Refer to the user account if registered
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
