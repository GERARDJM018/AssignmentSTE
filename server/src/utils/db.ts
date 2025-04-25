import mongoose from 'mongoose';

// Function to connect to the database (Create a connection with the database).
export const connectToDatabase = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/csvdata'; // Default to localhost when not in Docker
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('DB Connection Error:', err);
        process.exit(1);
    }
};
