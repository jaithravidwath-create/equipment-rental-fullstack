const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

const protect = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

app.use("/api/auth", authRoutes);

app.use("/api/equipment", equipmentRoutes);

app.use("/api/rentals", rentalRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Equipment Rental API is running"
    });
});

app.get("/api/test-protected", protect, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});


// Error handler must be last
app.use(errorHandler);


// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });