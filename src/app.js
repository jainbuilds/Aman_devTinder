const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
const UserModel = require("./models/user");

const connectDB = require("./config/database");

app.use(express.json()); 

// Register API - create a new user in the database
app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, age, gender } = req.body;
        const user = new UserModel({ firstName, lastName, emailId, password, age, gender }); 
        await user.save();
        res.status(201).json({ message: "User registered successfully" }); 
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Feed API - get all users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Get user by emailId API
app.get("/user", async (req, res) => {
    try {
        const emailId  = req.body.emailId;
        const user = await UserModel.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } 
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//find user by id and delete user API
app.delete("/deleteUser", async (req, res) => {
    try {
        const userId = req.body.id;
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        } 
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update user by id API
app.put(
    "/updateUser",
    [
        body("id")
            .notEmpty()
            .withMessage("User id is required")
            .isMongoId()
            .withMessage("Invalid user id format"),
        body("firstName")
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("First name must be between 2 and 50 characters")
            .matches(/^[A-Za-z\s'-]+$/)
            .withMessage("First name contains invalid characters"),
        body("lastName")
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("Last name must be between 2 and 50 characters")
            .matches(/^[A-Za-z\s'-]+$/)
            .withMessage("Last name contains invalid characters"),
        body("emailId")
            .custom((value, { req }) => {
                if (value === undefined) return true;
                throw new Error("Email cannot be updated");
            }),
        body("password")
            .optional()
            .isLength({ min: 6, max: 128 })
            .withMessage("Password must be between 6 and 128 characters"),
        body("age")
            .optional()
            .isInt({ min: 18, max: 100 })
            .withMessage("Age must be a number between 18 and 100"),
        body("gender")
            .optional()
            .trim()
            .isIn(["male", "female", "other"]) 
            .withMessage("Gender must be one of: male, female, other")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id, emailId, ...updatedData } = req.body;

            const allowedFields = ["firstName", "lastName", "password", "age", "gender"];
            const sanitizedData = {};

            for (const field of allowedFields) {
                if (updatedData[field] !== undefined) {
                    sanitizedData[field] = updatedData[field];
                }
            }

            if (Object.keys(sanitizedData).length === 0) {
                return res.status(400).json({ error: "No valid fields provided for update" });
            }

            const updatedUser = await UserModel.findByIdAndUpdate(id, sanitizedData, {
                new: true,
                runValidators: true
            });

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({
                message: "User updated successfully",
                user: updatedUser
            });
        } catch (error) {
            console.error("Error updating user:", error.message);

            if (error?.code === 11000) {
                return res.status(409).json({ error: "Email already exists" });
            }

            if (error?.name === "ValidationError") {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Connect to the database and start the server and then handle API routes
connectDB().then(() => {
    console.log("devTinder connected successfully");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777");
    });
}).catch((err) => {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
});
