import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find({}, 'username email createdAt');
    
    console.log('\n📋 Users in database:');
    console.log('==========================================');
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}`);
        console.log(`   Email: ${user.email || 'No email set'}`);
        console.log(`   Created: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'Unknown'}`);
        console.log('---');
      });
    }
    
    console.log(`\n📊 Total users: ${users.length}`);
    
    // Check specifically for webifymist@gmail.com
    const webifyUser = await User.findOne({ email: 'webifymist@gmail.com' });
    if (webifyUser) {
      console.log('✅ webifymist@gmail.com exists in database');
    } else {
      console.log('❌ webifymist@gmail.com NOT found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();