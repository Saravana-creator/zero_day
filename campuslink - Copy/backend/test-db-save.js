require('dotenv').config();
const connectDB = require('./config/database');
const Admin = require('./models/Admin');
const Student = require('./models/Student');

async function testDatabaseSave() {
  try {
    await connectDB();
    
    // Test creating admin
    console.log('Creating test admin...');
    const admin = new Admin({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'admin123'
    });
    
    const savedAdmin = await admin.save();
    console.log('✅ Admin saved:', savedAdmin.email);
    
    // Test creating student
    console.log('Creating test student...');
    const student = new Student({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'student123'
    });
    
    const savedStudent = await student.save();
    console.log('✅ Student saved:', savedStudent.email);
    
    // Verify they exist
    const foundAdmin = await Admin.findOne({ email: 'admin@test.com' });
    const foundStudent = await Student.findOne({ email: 'student@test.com' });
    
    console.log('✅ Admin found:', foundAdmin ? foundAdmin.email : 'NOT FOUND');
    console.log('✅ Student found:', foundStudent ? foundStudent.email : 'NOT FOUND');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabaseSave();