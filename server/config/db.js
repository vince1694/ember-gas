import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ember_gas';
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = !!conn.connections[0].readyState;
        console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    }
};

export default connectDB;
