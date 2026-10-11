# Equipment Rental API

A secure REST API for managing college equipment rentals.

Users can browse available equipment, request rentals, view their rental history, and cancel pending requests.

Admins can manage equipment, view all rental requests, approve or reject requests, and mark equipment as returned.

---

## Features

### User Features

- Register an account
- Login with JWT authentication
- View available equipment
- View equipment details
- Create rental requests
- View own rental history
- Cancel pending rental requests

### Admin Features

- Create equipment
- Update equipment
- Delete equipment
- View all equipment
- View all rental requests
- Approve rental requests
- Reject rental requests
- Mark equipment as returned
- Automatically manage equipment availability

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv
- Thunder Client for API testing

---

## Project Structure

```text
equipment-rental/
│
├── controllers/
│   ├── authController.js
│   ├── equipmentController.js
│   └── rentalController.js
│
├── middleware/
│   ├── adminMiddleware.js
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── models/
│   ├── User.js
│   ├── Equipment.js
│   └── Rental.js
│
├── routes/
│   ├── authRoutes.js
│   ├── equipmentRoutes.js
│   └── rentalRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── README.md
├── seed.js
└── server.js