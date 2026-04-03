const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, enum: ['attendance', 'marks'], required: true },
  
  // For attendance
  date: { type: Date },
  status: { type: String, enum: ['present', 'absent', 'late'] },
  
  // For marks
  subject: { type: String },
  score: { type: Number },
  total: { type: Number, default: 100 },
  assessmentName: { type: String }, // "Test 1", "Mid-term"
  
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);
