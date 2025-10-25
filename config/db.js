const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://tasktunesUser:tasktunesdatabasepassword91@tasktunescluster.ei2i8u3.mongodb.net/tasktunesDB?retryWrites=true&w=majority&appName=TaskTunesCluster');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
