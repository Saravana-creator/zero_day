require('dotenv').config();
const connectDB = require('./config/database');
const Admin = require('./models/Admin');
const Student = require('./models/Student');

async function testRegistration() {
  try {
    await connectDB();
    
    // Test admin registration
    console.log('Testing admin registration...');
    const admin = new Admin({
      name: 'Test Admin',
      email: 'testadmin@test.com',
      password: 'admin123'
    });
    await admin.save();
    console.log('✅ Admin saved to admins collection');
    
    // Test student registration
    console.log('Testing student registration...');
    const student = new Student({
      name: 'Test Student',
      email: 'teststudent@test.com',
      password: 'student123'
    });
    await student.save();
    console.log('✅ Student saved to students collection');
    
    // Check collections
    const mongoose = require('mongoose');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for(let col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      if(count > 0) {
        console.log(`${col.name}: ${count} documents`);
        const docs = await mongoose.connection.db.collection(col.name).find({}).toArray();
        docs.forEach(doc => console.log(`  - ${doc.email || doc.title || doc._id}`));
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testRegistration();