const Rental = require("../models/Rental");
const Equipment = require("../models/Equipment");

// Create rental request
const createRental = async (req, res) => {
    try {
        const { equipmentId, quantity } = req.body;

        if (!equipmentId || quantity === undefined) {
            return res.status(400).json({
                message: "Equipment ID and quantity are required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const equipment = await Equipment.findById(equipmentId);

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        if (equipment.status === "UNAVAILABLE") {
            return res.status(400).json({
                message: "Equipment is currently unavailable"
            });
        }

        if (quantity > equipment.availableQuantity) {
            return res.status(400).json({
                message: `Only ${equipment.availableQuantity} item(s) are available`
            });
        }

        const rental = await Rental.create({
            user: req.user.userId,
            equipment: equipmentId,
            quantity,
            status: "PENDING"
        });

        res.status(201).json({
            message: "Rental request created successfully",
            rental
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get logged-in user's rental history
const getMyRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({
            user: req.user.userId
        })
            .populate("equipment", "name category")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Rental history fetched successfully",
            rentals
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Cancel rental request
const cancelRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({
                message: "Rental request not found"
            });
        }

        if (rental.user.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only cancel your own rental requests"
            });
        }

        if (rental.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending rental requests can be cancelled"
            });
        }

        rental.status = "CANCELLED";

        await rental.save();

        res.status(200).json({
            message: "Rental request cancelled successfully",
            rental
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Admin: Get all rental requests
const getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find()
            .populate("user", "name email")
            .populate("equipment", "name category")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All rental requests fetched successfully",
            rentals
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Admin: Approve rental request
const approveRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({
                message: "Rental request not found"
            });
        }

        if (rental.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending rental requests can be approved"
            });
        }

        const equipment = await Equipment.findById(rental.equipment);

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        if (equipment.availableQuantity < rental.quantity) {
            return res.status(400).json({
                message: "Not enough equipment available"
            });
        }

        equipment.availableQuantity -= rental.quantity;

        if (equipment.availableQuantity === 0) {
            equipment.status = "UNAVAILABLE";
        } else {
            equipment.status = "AVAILABLE";
        }

        await equipment.save();

        rental.status = "APPROVED";
        rental.approvedAt = new Date();

        await rental.save();

        res.status(200).json({
            message: "Rental request approved successfully",
            rental,
            equipment
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Admin: Reject rental request
const rejectRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({
                message: "Rental request not found"
            });
        }

        if (rental.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending rental requests can be rejected"
            });
        }

        rental.status = "REJECTED";

        await rental.save();

        res.status(200).json({
            message: "Rental request rejected successfully",
            rental
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Admin: Mark rental as returned
const returnRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({
                message: "Rental request not found"
            });
        }

        if (rental.status !== "APPROVED") {
            return res.status(400).json({
                message: "Only approved rentals can be returned"
            });
        }

        const equipment = await Equipment.findById(rental.equipment);

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        equipment.availableQuantity += rental.quantity;

        if (equipment.availableQuantity > 0) {
            equipment.status = "AVAILABLE";
        } else {
            equipment.status = "UNAVAILABLE";
        }

        await equipment.save();

        rental.status = "RETURNED";
        rental.returnedAt = new Date();

        await rental.save();

        res.status(200).json({
            message: "Equipment returned successfully",
            rental,
            equipment
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createRental,
    getMyRentals,
    cancelRental,
    getAllRentals,
    approveRental,
    rejectRental,
    returnRental
};