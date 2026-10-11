const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Equipment = require("./models/Equipment");

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Create admin user if it doesn't exist
        const adminEmail = "admin@rental.com";

        let admin = await User.findOne({
            email: adminEmail
        });

        if (!admin) {
            const hashedPassword = await bcrypt.hash(
                "admin123",
                10
            );

            admin = await User.create({
                name: "Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN"
            });

            console.log("Admin user created");
        } else {
            console.log("Admin user already exists");
        }


        // Create sample user if it doesn't exist
        const userEmail = "user@rental.com";

        let user = await User.findOne({
            email: userEmail
        });

        if (!user) {
            const hashedPassword = await bcrypt.hash(
                "user123",
                10
            );

            user = await User.create({
                name: "Sample User",
                email: userEmail,
                password: hashedPassword,
                role: "USER"
            });

            console.log("Sample user created");
        } else {
            console.log("Sample user already exists");
        }


        // Create sample equipment
        const equipmentCount = await Equipment.countDocuments();

        if (equipmentCount === 0) {
            await Equipment.insertMany([
                {
                    name: "HP Laptop",
                    category: "Laptop",
                    quantity: 5,
                    availableQuantity: 5,
                    status: "AVAILABLE"
                },
                {
                    name: "Canon Camera",
                    category: "Camera",
                    quantity: 3,
                    availableQuantity: 3,
                    status: "AVAILABLE"
                },
                {
                    name: "Epson Projector",
                    category: "Projector",
                    quantity: 2,
                    availableQuantity: 2,
                    status: "AVAILABLE"
                }
            ]);

            console.log("Sample equipment created");
        } else {
            console.log("Equipment already exists");
        }


        console.log("");
        console.log("Seed completed successfully");
        console.log("");
        console.log("Admin:");
        console.log("Email: admin@rental.com");
        console.log("Password: admin123");
        console.log("");
        console.log("User:");
        console.log("Email: user@rental.com");
        console.log("Password: user123");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Seed failed:");
        console.error(error.message);

        process.exit(1);
    }
};

seedData();