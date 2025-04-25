import express from 'express';
import request from 'supertest';
import dataRouter from '../../routes/dataRoutes.js';

// Mock the controller functions
jest.mock('../../controllers/dataController.js', () => ({
  listData: jest.fn((req, res) => res.json({ message: 'listData' })),
  searchData: jest.fn((req, res) => res.json({ message: 'searchData' })),
  listCollections: jest.fn((req, res) => res.json({ message: 'listCollections' })),
  getCollectionFields: jest.fn((req, res) => res.json({ message: 'getCollectionFields' })),
}));

const app = express();
app.use('/', dataRouter);

describe('dataRouter', () => {
  it('GET /data should call listData controller', async () => {
    const res = await request(app).get('/data');
    expect(res.body).toEqual({ message: 'listData' });
  });

  it('GET /search should call searchData controller', async () => {
    const res = await request(app).get('/search');
    expect(res.body).toEqual({ message: 'searchData' });
  });

  it('GET /collections should call listCollections controller', async () => {
    const res = await request(app).get('/collections');
    expect(res.body).toEqual({ message: 'listCollections' });
  });

  it('GET /collection-fields should call getCollectionFields controller', async () => {
    const res = await request(app).get('/collection-fields');
    expect(res.body).toEqual({ message: 'getCollectionFields' });
  });
});
