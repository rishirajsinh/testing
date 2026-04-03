const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/students
// @desc    Get all students
// @access  Private (Teacher/Admin)
router.get('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/students
// @desc    Add a new student
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { name, rollNo, class: className, email, phone } = req.body;
    
    // Generate avatar initials
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    
    const student = await Student.create({
      name, rollNo, class: className, email, phone, avatar
    });
    
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
