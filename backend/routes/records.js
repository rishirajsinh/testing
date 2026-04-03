const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/records
// @desc    Add an attendance or mark record
// @access  Private (Teacher)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const record = await Record.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/records/student/:studentId
// @desc    Get all records for a specific student
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const records = await Record.find({ student: req.params.studentId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
