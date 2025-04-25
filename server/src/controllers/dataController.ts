import { Request, Response } from 'express';
import {addCollection, getCollections} from '../models/DataModel.js';

// Function to handle a request for entire data of a collection
// or file from the frontend usually and gives response/data. 
export const listData = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const collectionName = req.query.collection as string;
        const Model = addCollection(collectionName); 
        const data = await Model.find().skip(skip).limit(limit);
        const total = await Model.countDocuments();

        res.json({ page, totalPages: Math.ceil(total / limit), data });
    } catch (error) {
        console.error('Error searching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to handle a request for search to collection
// or file from the frontend usually and gives response/data. 
// export const searchData = async (req: Request, res: Response) => {
//     const q = req.query.q as string;
//     const collectionName = req.query.collection as string;
//     const Model = addCollection(collectionName);
//     const results = await Model.find({ $text: { $search: q } });
//     res.json(results);
// }
export const searchData = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const collectionName = req.query.collection as string;
    const field = req.query.field as string; // e.g. name, email, etc.

    try {
        const Model = addCollection(collectionName);

        // Dynamic filter: match field with case-insensitive regex
        const searchFilter = {
            [field]: { $regex: q, $options: 'i' }
        };

        const results = await Model.find(searchFilter).exec();
        res.json(results);
    } catch (error) {
        console.error('Error searching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to handle a request for entire collections or files
// from the frontend usually and gives response/data. 
export const listCollections = async (req: Request, res: Response) => {
    const collections = await getCollections();
    const names = collections.map(c => c.name);
    res.json(names);
};


export const getCollectionFields = async (req: Request, res: Response) => {
    const collectionName = req.query.collection as string;


    try {
        const Model = addCollection(collectionName);
        const sampleDoc = await Model.findOne(); // get one doc to infer keys

        if (!sampleDoc) {
        } else {
            const fields = Object.keys(sampleDoc.toObject()).filter(f => f !== '__v' && f !== '_id');
            res.json({ fields });
        }

    } catch (err) {
        console.error('Error getting collection fields:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

