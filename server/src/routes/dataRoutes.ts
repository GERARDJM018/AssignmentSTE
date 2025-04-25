// Handle the route API for the data.

import express from 'express';
import { listData, searchData, listCollections, getCollectionFields} from '../controllers/dataController.js';

const router = express.Router();

// Route for list Data.
router.get('/data', listData);

// Route for search Data.
router.get('/search', searchData);

// Route for list collections.
router.get('/collections', listCollections);

router.get('/collection-fields', getCollectionFields);

export default router;