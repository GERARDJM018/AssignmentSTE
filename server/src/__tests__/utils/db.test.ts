import mongoose from 'mongoose';
import { connectToDatabase } from '../../utils/db.js';  // Adjust the path if needed

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue('mocked connection'),  // Mock DB connection
}));

test('should mock DB connection', async () => {
  await connectToDatabase();
  expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/csvdata');
});
