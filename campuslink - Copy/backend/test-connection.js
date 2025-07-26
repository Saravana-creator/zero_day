require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');

async function testConnection() {
  try {
    await connectDB();
    console.log('✅ Database connection successful');
    
    // Test creating a user
    const testUser = new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    
    console.log('✅ User model works');
    console.log('🔧 Ready to start server with: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();