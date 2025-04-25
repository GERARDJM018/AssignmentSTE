// Handle route API for the upload data 

import express from 'express';
import multer from 'multer';
import { uploadCSV } from '../controllers/uploadController.js';

const router = express.Router();

// Create a multer middleware to save the uploaded file
// to you disc first before uploading it into the database.
const upload = multer({ dest: 'uploads/' });

// Route to upload a file to the database with using 
// multer as middleware.
router.post('/upload', upload.single('file'), uploadCSV);
export default router;