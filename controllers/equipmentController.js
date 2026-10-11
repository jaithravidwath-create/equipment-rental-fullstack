const Equipment = require("../models/Equipment");

// Get all equipment
const getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find();

        res.status(200).json({
            message: "Equipment fetched successfully",
            equipment
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get equipment by ID
const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        res.status(200).json({
            message: "Equipment fetched successfully",
            equipment
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Create new equipment
const createEquipment = async (req, res) => {
    try {
        const {
            name,
            category,
            quantity
        } = req.body;

        if (!name || !category || quantity === undefined) {
            return res.status(400).json({
                message: "Name, category and quantity are required"
            });
        }

        if (quantity < 0) {
            return res.status(400).json({
                message: "Quantity cannot be negative"
            });
        }

        const equipment = await Equipment.create({
            name,
            category,
            quantity,
            availableQuantity: quantity,
            status: quantity > 0 ? "AVAILABLE" : "UNAVAILABLE"
        });

        res.status(201).json({
            message: "Equipment created successfully",
            equipment
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Update equipment
const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        const { name, category, quantity } = req.body;

        if (name !== undefined) {
            equipment.name = name;
        }

        if (category !== undefined) {
            equipment.category = category;
        }

        if (quantity !== undefined) {
            if (quantity < 0) {
                return res.status(400).json({
                    message: "Quantity cannot be negative"
                });
            }

            const rentedQuantity =
                equipment.quantity - equipment.availableQuantity;

            if (quantity < rentedQuantity) {
                return res.status(400).json({
                    message: `Quantity cannot be less than currently rented quantity (${rentedQuantity})`
                });
            }

            equipment.quantity = quantity;
            equipment.availableQuantity = quantity - rentedQuantity;
        }

        equipment.status =
            equipment.availableQuantity > 0
                ? "AVAILABLE"
                : "UNAVAILABLE";

        await equipment.save();

        res.status(200).json({
            message: "Equipment updated successfully",
            equipment
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Delete equipment
const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        if (equipment.availableQuantity !== equipment.quantity) {
            return res.status(400).json({
                message: "Cannot delete equipment that is currently rented"
            });
        }

        await Equipment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Equipment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};