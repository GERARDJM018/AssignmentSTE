import supertest from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import uploadRouter from '../../routes/uploadRoutes.js';
import { uploadCSV } from '../../controllers/uploadController.js';
import multer from 'multer';

// Initialize express app
const app = express();
app.use('/', uploadRouter);

// Mock the uploadCSV controller
jest.mock('../../controllers/uploadController.js', () => ({
  uploadCSV: jest.fn((req, res) => res.json({ message: 'File uploaded successfully' })),
}));

// Mock Multer middleware to simulate file handling
jest.mock('multer', () => () => ({
    single: jest.fn().mockImplementation((fieldName: string) => {
      return (req: Request, res: Response, next: NextFunction) => {
        const hasFile =
          req.headers['content-type']?.startsWith('multipart/form-data') &&
          req.headers['content-length'] !== '0';
  
        if (!hasFile) {
          return res.status(400).json({ message: 'No file uploaded.' });
        }
  
        // Simulate multer processing (you can make this more realistic if needed)
  
        next();
      };
    }),
  }));
  

jest.setTimeout(10000); // Increase timeout if needed

describe('Upload Routes', () => {
  test('should return 400 if no file is uploaded', async () => {
    const response = await supertest(app).post('/upload').send();  // Send POST without a file
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No file uploaded.');
  });

  test('should call the uploadCSV controller with a file', async () => {
    const fileData = Buffer.from('dummy,csv,data\nvalue1,value2');  // Simulate CSV file
    const response = await supertest(app)
      .post('/upload')
      .attach('file', fileData, 'test.csv');  // Attach the simulated file

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');
  });
});
