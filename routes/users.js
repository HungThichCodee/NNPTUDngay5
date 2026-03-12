var express = require('express');
var router = express.Router();
let UserModel = require('../schemas/users');

// 1. CRUD users
router.get('/', async function(req, res, next) {
    try {
        let users = await UserModel.find({ isDeleted: false }).populate('role');
        res.status(200).send({ success: true, data: users });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        let user = await UserModel.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

router.post('/', async function(req, res, next) {
    try {
        let newUser = new UserModel(req.body);
        await newUser.save();
        res.status(201).send({ success: true, data: newUser });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        let updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        let deletedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedUser) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// 2. POST /users/enable
router.post('/enable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ success: false, message: "Email and username are required" });
        }
        let user = await UserModel.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found or credentials incorrect" });
        }
        res.status(200).send({ success: true, data: user, message: "User enabled successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// 3. POST /users/disable
router.post('/disable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ success: false, message: "Email and username are required" });
        }
        let user = await UserModel.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found or credentials incorrect" });
        }
        res.status(200).send({ success: true, data: user, message: "User disabled successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
