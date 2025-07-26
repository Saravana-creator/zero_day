require('dotenv').config();
const mongoose = require('mongoose');

// Test MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.mongodb.net/campuslink?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Atlas Connected Successfully!');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  process.exit(0);
}).catch(err => {
  console.error('❌ MongoDB Connection Failed:', err.message);
  process.exit(1);
});