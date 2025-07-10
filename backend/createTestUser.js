import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import userModel from './models/userModel.js';

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopville');
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await userModel.findOne({ phone: '300-1234567' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = new userModel({
      name: 'Test User',
      email: 'test@example.com',
      phone: '300-1234567',
      password: hashedPassword,
      role: 0 // Regular user
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Phone: 300-1234567');
    console.log('Password: password123');
    console.log('Email: test@example.com');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestUser(); 