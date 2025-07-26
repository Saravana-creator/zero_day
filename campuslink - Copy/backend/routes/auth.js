const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    console.log('Checking for existing users...');
    // Check if user exists in either collection
    const existingAdmin = await Admin.findOne({ email });
    const existingStudent = await Student.findOne({ email });
    
    if (existingAdmin || existingStudent) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating new user with role:', role);
    let user;
    if (role === 'admin') {
      user = new Admin({ name, email, password });
      console.log('Created admin user object');
    } else {
      user = new Student({ name, email, password });
      console.log('Created student user object');
    }
    
    console.log('Saving user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);

    const token = jwt.sign({ userId: savedUser._id, role: role }, JWT_SECRET, { expiresIn: '7d' });
    console.log('JWT token created');
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role: role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role: loginRole } = req.body;
    
    // Check both collections to find where user is registered
    const adminUser = await Admin.findOne({ email });
    const studentUser = await Student.findOne({ email });
    
    // If user doesn't exist in either collection
    if (!adminUser && !studentUser) {
      return res.status(400).json({ 
        message: 'User not found. Please sign up first.' 
      });
    }
    
    // Check if user is trying to login with wrong role
    if (loginRole === 'admin' && !adminUser && studentUser) {
      return res.status(403).json({ 
        message: 'Access Denied! You are registered as a Student. Please login as Student.',
        wrongRole: true,
        registeredAs: 'student'
      });
    }
    
    if (loginRole === 'student' && !studentUser && adminUser) {
      return res.status(403).json({ 
        message: 'Access Denied! You are registered as an Admin. Please login as Admin.',
        wrongRole: true,
        registeredAs: 'admin'
      });
    }
    
    // Get the correct user based on their actual registration
    const user = adminUser || studentUser;
    const actualRole = adminUser ? 'admin' : 'student';
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id, role: actualRole }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: actualRole }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Get all users (for testing)
router.get('/users', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    const students = await Student.find().select('-password');
    
    res.json({
      admins: admins.map(a => ({ ...a.toObject(), role: 'admin' })),
      students: students.map(s => ({ ...s.toObject(), role: 'student' })),
      total: admins.length + students.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;