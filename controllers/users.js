const mongodb = require('../config/database.js');
const ObjectId = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');

const User = require ('../models/users.js')

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().collection('users').find();
        const users = await result.toArray();
        res.setHeader('content-type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('users').find({ _id: userId });
        const users = await result.toArray();

        if (!users[0]) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.setHeader('content-type', 'application/json');
        res.status(200).json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};

const createUser = async (req, res) => {

    try {
        let user = new User(req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.role, req.body.location, req.body.password);
        const response = await  mongodb.getDatabase().collection('users').insertOne(user);
        if (response.acknowledged) {
            res.status(201).json({ message: 'User created successfully', userId: response.insertedId });
        } else {
            res.status(500).json({ message: "Can't create user, some error occurred" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = new ObjectId(req.params.id);
        let user = new User(req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.role, req.body.location, req.body.password, new Date().updatedAt);

        const response = await mongodb.getDatabase().collection('users').replaceOne({ _id: userId }, user);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found or no changes applied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().collection('users').deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};
