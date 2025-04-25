import mongoose from 'mongoose';


// Handle the schema of the uploaded data. Since the schema 
// may vary, it didn't specify any schema
const dataSchema = new mongoose.Schema({}, { strict: false });

// Create a wildcard text index for all string fields 
// (for the search function).
dataSchema.index({ "$**": "text" });

// Function to add new collections to the database.
const addCollection = (name: string) => {
    return mongoose.model('Dynamic', dataSchema, name);
}

// Function to get the available collections from the database.
const getCollections = () => {
    return mongoose.connection.db!.listCollections().toArray();
}

export { addCollection, getCollections };