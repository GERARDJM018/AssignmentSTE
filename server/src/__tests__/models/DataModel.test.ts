// __tests__/models/DataModel.test.ts

import mongoose from 'mongoose';
import { addCollection, getCollections } from '../../models/DataModel.js';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');

  const mockModel = jest.fn();
  const mockToArray = jest.fn();
  const mockListCollections = jest.fn().mockReturnValue({ toArray: mockToArray });

  return {
    ...actualMongoose,
    model: mockModel,
    connection: {
      db: {
        listCollections: mockListCollections,
      },
    },
    __mockModel: mockModel,
    __mockToArray: mockToArray,
    __mockListCollections: mockListCollections,
  };
});

const mockedMongoose = mongoose as unknown as typeof mongoose & {
  __mockModel: jest.Mock;
  __mockToArray: jest.Mock;
  __mockListCollections: jest.Mock;
};

describe('DataModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    test('should create a model with the given collection name', () => {
        const name = 'testCollection';
        addCollection(name);

        expect(mockedMongoose.__mockModel).toHaveBeenCalledWith(
        'Dynamic',
        expect.anything(),
        name
        );
    });



    test('should list collections from the database', async () => {
      const mockCollections = [
        { name: 'users' },
        { name: 'products' }
      ];

      mockedMongoose.__mockToArray.mockResolvedValue(mockCollections);

      const collections = await getCollections();

      expect(mockedMongoose.__mockListCollections).toHaveBeenCalled();
      expect(mockedMongoose.__mockToArray).toHaveBeenCalled();
      expect(collections).toEqual(mockCollections);
    });
    
  });

