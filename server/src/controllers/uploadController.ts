import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { addCollection } from '../models/DataModel.js';

// Function to handle a request for uploading file
export const uploadCSV = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }

    // Check if the file is a CSV
    if (!req.file.originalname.endsWith('.csv')) {
        res.status(400).json({ message: 'Invalid file type. Please upload a CSV file.' });
        return;
    }

    console.log(req.file);  // Log file details to check the path
    console.log('File path:', req.file.path); // Log the file path specifically

    try {
        // Wrap the CSV stream into a Promise and directly assign the results
        const results: any[] = await new Promise((resolve, reject) => {
            const resultsArray: any[] = [];

            fs.createReadStream(req.file!.path)
                .pipe(csv())
                .on('data', (data) => resultsArray.push(data))
                .on('end', () => resolve(resultsArray)) // Resolve with all data once 'end' is reached
                .on('error', reject);
        });

        console.log(results);

        // Process the results: Clean the data and rename 'id' to 'csvId' if necessary
        const cleanedResults = results.map(item => {
            const cleanedItem: any = {};

            for (const key in item) {
                const cleanKey = key.replace(/^\uFEFF/, '');  // Clean BOM from header
                cleanedItem[cleanKey] = item[key];
            }

            // Rename 'id' to 'csvId'
            if ('id' in cleanedItem) {
                cleanedItem.csvId = cleanedItem.id;
                delete cleanedItem.id;
            }

            return cleanedItem;
        });

        const collection = addCollection(req.file.originalname);
        console.log('First row:', JSON.stringify(cleanedResults[0], null, 2));
        await collection.insertMany(cleanedResults);
        fs.unlinkSync(req.file!.path);  // delete file after use

        res.json({ message: 'Upload successful.', count: cleanedResults.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing file.' });
    }
};
