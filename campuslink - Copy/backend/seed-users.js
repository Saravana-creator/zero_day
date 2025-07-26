require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');

async function seedUsers() {
  try {
    await connectDB();
    
    // Check if users already exist
    const existingAdmin = await User.findOne({ email: 'admin@campus.com' });
    const existingStudent = await User.findOne({ email: 'student@campus.com' });
    
    if (!existingAdmin) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@campus.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created: admin@campus.com / admin123');
    }
    
    if (!existingStudent) {
      const student = new User({
        name: 'Student User',
        email: 'student@campus.com',
        password: 'student123',
        role: 'student'
      });
      await student.save();
      console.log('✅ Student user created: student@campus.com / student123');
    }
    
    console.log('🎯 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedUsers();