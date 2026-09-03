import mongoose from 'mongoose';

const ATLAS_URI = 'mongodb+srv://hbet1988_db_user:ChhphbVkmNRddZuk@embergas.y5qf7yy.mongodb.net/ember_gas?retryWrites=true&w=majority&appName=Embergas';

let cachedPromise = null;

const connectDB = async () => {
    // 1. Return existing active connection
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // 2. Return pending connection promise if in progress
    if (mongoose.connection.readyState === 2 && cachedPromise) {
        return cachedPromise;
    }

    const mongoUri = process.env.MONGO_URI || ATLAS_URI;

    cachedPromise = mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
    }).then(conn => {
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        return conn;
    }).catch(err => {
        cachedPromise = null;
        console.warn(`⚠️ MongoDB Connection Warning: ${err.message}`);
        // Return null instead of crashing, but do not cache failure
        return null;
    });

    return cachedPromise;
};

export default connectDB;
