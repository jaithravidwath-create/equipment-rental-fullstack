const express = require("express");

const router = express.Router();

const {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
} = require("../controllers/equipmentController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");


// Authenticated users: view all equipment
router.get("/", protect, getEquipment);


// Authenticated users: view equipment by ID
router.get("/:id", protect, getEquipmentById);


// Admin: create equipment
router.post("/", protect, adminOnly, createEquipment);


// Admin: update equipment
router.patch("/:id", protect, adminOnly, updateEquipment);


// Admin: delete equipment
router.delete("/:id", protect, adminOnly, deleteEquipment);


module.exports = router;