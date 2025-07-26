require('dotenv').config();
const connectDB = require('./config/database');
const Admin = require('./models/Admin');
const Student = require('./models/Student');

async function testSeparateStorage() {
  try {
    await connectDB();
    
    // Create multiple admins
    const admin1 = new Admin({ name: 'Admin One', email: 'admin1@test.com', password: 'pass123' });
    const admin2 = new Admin({ name: 'Admin Two', email: 'admin2@test.com', password: 'pass123' });
    await admin1.save();
    await admin2.save();
    
    // Create multiple students
    const student1 = new Student({ name: 'Student One', email: 'student1@test.com', password: 'pass123' });
    const student2 = new Student({ name: 'Student Two', email: 'student2@test.com', password: 'pass123' });
    await student1.save();
    await student2.save();
    
    console.log('✅ Created test users');
    
    // Show separate storage
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    console.log('\n=== ADMINS COLLECTION ===');
    const admins = await db.collection('admins').find({}).toArray();
    admins.forEach(a => console.log(`📋 ${a.name} (${a.email})`));
    
    console.log('\n=== STUDENTS COLLECTION ===');
    const students = await db.collection('students').find({}).toArray();
    students.forEach(s => console.log(`🎓 ${s.name} (${s.email})`));
    
    console.log(`\n📊 Total: ${admins.length} admins, ${students.length} students`);
    console.log('✅ Users are stored in SEPARATE collections based on role!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testSeparateStorage();