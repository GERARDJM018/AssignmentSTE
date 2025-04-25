import { listData, searchData, listCollections, getCollectionFields } from '../../controllers/dataController.js';
import { addCollection, getCollections } from '../../models/DataModel.js';
import { Request, Response } from 'express';

jest.mock('../../models/DataModel');

const mockRes = () => {
  const res = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('dataController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('listData returns paginated data', async () => {
    const req = {
      query: { page: '1', limit: '10', collection: 'testCollection' }
    } as unknown as Request;

    const mockModel = {
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ name: 'Test' }]),
      countDocuments: jest.fn().mockResolvedValue(1)
    };

    (addCollection as jest.Mock).mockReturnValue(mockModel);

    const res = mockRes();

    await listData(req, res);

    expect(mockModel.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ page: 1, totalPages: 1, data: [{ name: 'Test' }] });
  });

  test('listData returns empty data when collection has no documents', async () => {
    const req = {
      query: { page: '1', limit: '10', collection: 'emptyCollection' }
    } as unknown as Request;

    const mockModel = {
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
      countDocuments: jest.fn().mockResolvedValue(0)
    };

    (addCollection as jest.Mock).mockReturnValue(mockModel);

    const res = mockRes();

    await listData(req, res);

    expect(mockModel.find).toHaveBeenCalled();
    expect(mockModel.countDocuments).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ page: 1, totalPages: 0, data: [] });
  });

  test('listData handles non-existent collection gracefully', async () => {
    const req = {
      query: { page: '1', limit: '10', collection: 'nonExistent' }
    } as unknown as Request;

    (addCollection as jest.Mock).mockReturnValue(undefined); // simulate missing collection

    const res = mockRes();

    await listData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });


  test('searchData returns matching documents', async () => {
    const req = {
      query: { q: 'John', collection: 'testCollection', field: 'name' }
    } as unknown as Request;

    const mockModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([{ name: 'John' }]) })
    };

    (addCollection as jest.Mock).mockReturnValue(mockModel);
    const res = mockRes();

    await searchData(req, res);

    expect(mockModel.find).toHaveBeenCalledWith({ name: { $regex: 'John', $options: 'i' } });
    expect(res.json).toHaveBeenCalledWith([{ name: 'John' }]);
  });

  test('searchData returns nothing when doesnt match', async () => {
    const req = {
      query: { q: 'John', collection: 'testCollection', field: 'name' }
    } as unknown as Request;

    const mockModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([{}]) })
    };

    (addCollection as jest.Mock).mockReturnValue(mockModel);
    const res = mockRes();

    await searchData(req, res);

    expect(mockModel.find).toHaveBeenCalledWith({ name: { $regex: 'John', $options: 'i' } });
    expect(res.json).toHaveBeenCalledWith([{}]);
  });

  test('listCollections returns collection names', async () => {
    const req = {} as Request;
    const res = mockRes();

    (getCollections as jest.Mock).mockResolvedValue([{ name: 'test1' }, { name: 'test2' }]);

    await listCollections(req, res);

    expect(res.json).toHaveBeenCalledWith(['test1', 'test2']);
  });

  test('getCollectionFields returns filtered fields', async () => {
    const req = { query: { collection: 'testCollection' } } as unknown as Request;
    const res = mockRes();

    const mockDoc = {
      toObject: () => ({ _id: '123', __v: 0, name: 'Test', age: 30 })
    };

    const mockModel = {
      findOne: jest.fn().mockResolvedValue(mockDoc)
    };

    (addCollection as jest.Mock).mockReturnValue(mockModel);

    await getCollectionFields(req, res);

    expect(mockModel.findOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ fields: ['name', 'age'] });
  });
});
