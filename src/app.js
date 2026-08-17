const express = require("express");
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
app.put("/updateUser", async (req, res) => {
    try {
        const userId = req.body.id;
        const updatedData = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
  });

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
