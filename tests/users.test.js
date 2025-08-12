const { getAll, getSingle, createUser, updateUser, deleteUser } = require('../controllers/users');
const mongodb = require('../config/database');
const { validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

// dta base mock
jest.mock('../config/database', () => ({
  getDatabase: jest.fn()
}));


// Mock user model
jest.mock('../models/users.js', () => {
  return jest.fn().mockImplementation((firstName, lastName, email, phone, role, location, password) => {
    return { firstName, lastName, email, phone, role, location, password };
  });
});

describe('Users Controller', () => {
  let mockRes;
  let mockCollection;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn()
    };

    mockCollection = {
      find: jest.fn(),
      toArray: jest.fn(),
      insertOne: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn()
    };

    mongodb.getDatabase.mockReturnValue({
      collection: jest.fn(() => mockCollection),
      db: jest.fn(() => ({ collection: jest.fn(() => mockCollection) }))
    });
  });

  
  // Test GET ALL
  it('should return all users', async () => {
    const fakeUsers = [{ _id: '1', firstName: 'John' }];
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(fakeUsers) });

    await getAll({}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(fakeUsers);
  });

  // Test GET SINGLE (user found)
  it('should return a single user if found', async () => {
    const fakeUser = { _id: '1', firstName: 'John' };
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([fakeUser]) });

    await getSingle({ params: { id: new ObjectId().toString() } }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(fakeUser);
  });

  // Test GET SINGLE (not found)
  it('should return 404 if user not found', async () => {
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) });

    await getSingle({ params: { id: new ObjectId().toString() } }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  // Test CREATE
  it('should create a user successfully', async () => {
    mockCollection.insertOne.mockResolvedValue({ acknowledged: true, insertedId: '123' });

    const req = { body: { firstName: 'John', lastName: 'Doe', email: 'j@doe.com', phone: '123', role: 'admin', location: 'city', password: 'pass' } };
    await createUser(req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User created successfully', userId: '123' });
  });

  // Test UPDATE (success)
  it('should update a user successfully', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    mockCollection.replaceOne.mockResolvedValue({ modifiedCount: 1 });

    const req = { params: { id: new ObjectId().toString() }, body: { firstName: 'Updated' } };
    await updateUser(req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
  });

  // Test UPDATE (not found)
  it('should return 404 if no user updated', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    mockCollection.replaceOne.mockResolvedValue({ modifiedCount: 0 });

    const req = { params: { id: new ObjectId().toString() }, body: { firstName: 'Updated' } };
    await updateUser(req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  // Test DELETE (success)
  it('should delete a user successfully', async () => {
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await deleteUser({ params: { id: new ObjectId().toString() } }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
  });

  // Test DELETE (not found)
  it('should return 404 if user not found', async () => {
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await deleteUser({ params: { id: new ObjectId().toString() } }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });
});
