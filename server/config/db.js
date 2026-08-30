import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ember_gas';
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    }
};

export default connectDB;
