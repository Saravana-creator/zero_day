const express = require('express');
const Session = require('../models/Session');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all sessions
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find().populate('createdBy', 'name email').populate('bookedBy', 'name email');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create session (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, date, time, location, capacity } = req.body;
    
    const session = new Session({
      title,
      description,
      date,
      time,
      location,
      capacity,
      createdBy: req.user._id
    });
    
    await session.save();
    await session.populate('createdBy', 'name email');
    
    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book session
router.post('/:id/book', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.bookedBy.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already booked this session' });
    }

    if (session.bookedBy.length >= session.capacity) {
      return res.status(400).json({ message: 'Session is full' });
    }

    session.bookedBy.push(req.user._id);
    await session.save();
    
    res.json({ message: 'Session booked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.delete('/:id/book', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.bookedBy = session.bookedBy.filter(userId => !userId.equals(req.user._id));
    await session.save();
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;