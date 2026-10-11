const express = require("express");

const router = express.Router();

const {
    createRental,
    getMyRentals,
    cancelRental,
    getAllRentals,
    approveRental,
    rejectRental,
    returnRental
} = require("../controllers/rentalController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");


// USER: Create rental request
router.post("/", protect, createRental);


// USER: View own rental history
router.get("/my", protect, getMyRentals);


// USER: Cancel own pending rental
router.patch("/:id/cancel", protect, cancelRental);


// ADMIN: View all rental requests
router.get("/admin/all", protect, adminOnly, getAllRentals);


// ADMIN: Approve rental request
router.patch(
    "/admin/:id/approve",
    protect,
    adminOnly,
    approveRental
);


// ADMIN: Reject rental request
router.patch(
    "/admin/:id/reject",
    protect,
    adminOnly,
    rejectRental
);


// ADMIN: Mark rental as returned
router.patch(
    "/admin/:id/return",
    protect,
    adminOnly,
    returnRental
);


module.exports = router;