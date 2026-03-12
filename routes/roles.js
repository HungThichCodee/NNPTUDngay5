var express = require('express');
var router = express.Router();
let RoleModel = require('../schemas/roles');
let UserModel = require('../schemas/users');

// 1. CRUD roles
router.get('/', async function(req, res, next) {
    try {
        let roles = await RoleModel.find({ isDeleted: false });
        res.status(200).send({ success: true, data: roles });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        let role = await RoleModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ success: false, message: "Role not found" });
        }
        res.status(200).send({ success: true, data: role });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

router.post('/', async function(req, res, next) {
    try {
        let newRole = new RoleModel(req.body);
        await newRole.save();
        res.status(201).send({ success: true, data: newRole });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        let updatedRole = await RoleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updatedRole) {
            return res.status(404).send({ success: false, message: "Role not found" });
        }
        res.status(200).send({ success: true, data: updatedRole });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        let deletedRole = await RoleModel.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedRole) {
            return res.status(404).send({ success: false, message: "Role not found" });
        }
        res.status(200).send({ success: true, message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// 4. GET /roles/:id/users
router.get('/:id/users', async function(req, res, next) {
    try {
        let users = await UserModel.find({ role: req.params.id, isDeleted: false }).populate('role');
        res.status(200).send({ success: true, data: users });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
