import { uploadCSV } from '../../controllers/uploadController.js';
import { addCollection } from '../../models/DataModel.js';
import { Request, Response } from 'express';
import fs from 'fs';

// Mocking fs and csv-parser
jest.mock('fs');
jest.mock('csv-parser', () => () => ({
  on: function (event: string, callback: any) {
    if (event === 'data') callback({ name: 'John', id: '123' });
    if (event === 'end') setTimeout(callback, 0);  // Simulate the end of the stream
    return this;
  }
}));
jest.mock('../../models/DataModel.js');

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('uploadController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 if no file is uploaded', async () => {
        const req = {} as Request;
        const res = mockRes();

        await uploadCSV(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded.' });
    });

    test('should parse CSV and insert data to collection and return results', async () => {
        const req = {
            file: {
                path: 'mock/path/file.csv',
                originalname: 'testCollection.csv'
            }
        } as unknown as Request;
        const res = mockRes();

        const mockInsertMany = jest.fn();
        (addCollection as jest.Mock).mockReturnValue({ insertMany: mockInsertMany });

        // Mocking the CSV stream to simulate data events
        (fs.createReadStream as jest.Mock).mockReturnValue({
            pipe: () => ({
                on: function (event: string, callback: any) {
                    if (event === 'data') {
                        // Simulate streaming data
                        setImmediate(() => callback({ name: 'Alice', id: '123' }));
                    }
                    if (event === 'end') {
                        setImmediate(callback);
                    }
                    return this;
                }
            })
        });

        (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

        await uploadCSV(req, res); // Capture the results


        // Verify insert and unlink
        expect(mockInsertMany).toHaveBeenCalledWith([{ name: 'Alice', csvId: '123' }]);
        expect(fs.unlinkSync).toHaveBeenCalledWith('mock/path/file.csv');
        expect(res.json).toHaveBeenCalledWith({ message: 'Upload successful.', count: 1 });
    });

    test('uploadCSV returns 400 if uploaded file is not a CSV', async () => {
        const req = {
            file: {
                originalname: 'file.txt',
                path: 'mock/path/file.txt'
            }
        } as unknown as Request;
        
        const res = mockRes();
        
        await uploadCSV(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid file type. Please upload a CSV file.' });
    });

    test('should handle errors and respond with 500', async () => {
        const req = {
            file: {
                path: 'mock/path/file.csv',
                originalname: 'testCollection.csv'
            }
        } as unknown as Request;
        const res = mockRes();
    
        // Mock fs.createReadStream to throw an error immediately
        (fs.createReadStream as jest.Mock).mockImplementation(() => {
            throw new Error('Stream error');
        });
    
        // Run the function that should trigger the error
        await uploadCSV(req, res);
    
        // Assert that the correct status and error message are returned
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error processing file.' });
    });
      
});
