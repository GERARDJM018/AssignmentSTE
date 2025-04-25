import express from 'express';
import cors from 'cors';
import uploadRoutes from './src/routes/uploadRoutes.js';
import dataRoutes from './src/routes/dataRoutes.js';
import { connectToDatabase } from './src/utils/db.js';


// Create an instance of express web server.
const app = express();

// Port number that will be used for the backend server.
const PORT = 3001;

// Use CORS middleware for the server to enables cross-origin
// requests (frontend and backend even on different port).  
app.use(cors());

// Parse the request into express JSON payloads.
// To make the route handle the request easily.
app.use(express.json());

// Use the upload route that has been set on the uploadRoutes.
app.use('/api', uploadRoutes);

// Use the data route that has been set on the dataRoutes.
app.use('/api', dataRoutes);

// Call the function to connect to the database.
// Then create a backend on the specified port.
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});