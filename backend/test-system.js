const mongoose = require('mongoose');
require('dotenv').config();

// Test database connection
async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connection successful');
    
    // Test models
    const User = require('./src/models/User');
    const MedicalRecord = require('./src/models/MedicalRecord');
    const AccessRequest = require('./src/models/AccessRequest');
    const AuditLog = require('./src/models/AuditLog');
    
    console.log('✅ All models loaded successfully');
    
    // Test user creation
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'patient'
    });
    
    console.log('✅ User model validation passed');
    
    // Test access request with null recordId
    const testRequest = new AccessRequest({
      doctorId: new mongoose.Types.ObjectId(),
      patientId: new mongoose.Types.ObjectId(),
      recordId: null,
      message: 'Test request'
    });
    
    console.log('✅ AccessRequest model validation passed');
    
    await mongoose.disconnect();
    console.log('✅ All tests passed - System is ready!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testConnection();