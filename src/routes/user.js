const express = require("express");
const userRouter = express.Router();
const User = require("../config/userSchema");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const submission = require('../config/submissionSchema')
const client = require('../redis/redisLogin');
const userValidate = require("../middleware/userValidate")
const validateDetails = require("../validation/validateDetails");

function tokenGeneration(userName, userEmail) {
    const token = jwt.sign({ name: userName, email: userEmail }, process.env.SECRET_KEY, { expiresIn: "1h" });
    return token;
}

userRouter.post("/register", async (req, res) => {
    try {
        const userData = req.body;
        validateDetails(userData);
        userData.password = await bcrypt.hash(userData.password, 10);
        userData.user = "user";
        const backend = await User.create(userData);
        const reply = {
            name: backend.name,
            id: backend._id,
            email: backend.email,
        }
        const token = await jwt.sign({"id": backend._id, "name": backend.name, "email": backend.email}, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);
        res.status(200).json({
            user: reply,
            message: "login succesfull"
        });
    }
    catch (err) {
        res.send(err.message);
    }
})


userRouter.get("/", async (req, res) => {
    try {
        const loginToken = req.cookies.token;
        if (!loginToken) {
            return res.status(401).send("No token provided");
        }
        const payload = jwt.verify(loginToken, process.env.SECRET_KEY);
        const isBlocked = await client.get(`token:${loginToken}`);
        if (isBlocked) {
            return res.status(403).send("Token is blocked (logged out)");
        }
        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(401).send({ error: err.message });
    }
});


userRouter.get("/login", async (req, res) => {
    try {
        const loginDetails = req.body;
        if (!loginDetails) {
            throw new Error("fill all the detials");
        }
        const mail = loginDetails.email;
        if (!mail) {
            throw new Error("invalid login details");
        }
        const pass = loginDetails.password;
        if (!pass) {
            throw new Error("invalid login details");
        }
        const backend = await User.findOne({ email: mail })
        if (!backend) {
            throw new Error("invalid login detials");
        }
        const backendPass = backend.password;
        const login = await bcrypt.compare(pass, backendPass);
        if (!login) {
            throw new Error("invalid login detials");
        }
        const reply = {
            name: backend.name,
            id: backend._id,
            email: backend.email,
        }
        const token = await jwt.sign({"id": backend._id, "name": backend.name, "email": backend.email}, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);
        res.status(200).json({
            user: reply,
            message: "login succesfull"
        });
    }
    catch (err) {
        res.status(401).send(err.message);
    }
})


userRouter.post("/logout", async (req, res) => {
    try {
        const loginToken = req.cookies.token;
        if (!loginToken) {
            return res.status(401).send("already looged out");
        }
        const payload = jwt.verify(loginToken, process.env.SECRET_KEY);
        console.log(payload)
        await client.set(`token:${loginToken}`, "blocked");
        await client.expireAt(`token:${loginToken}`, payload.exp);
        res.cookie("token", null, new Date(Date.now()));
        res.status(200).send("Logged out successfully");
    }
    catch (err) {
        res.status(503).send({ error: err.message });
    }
});


userRouter.post("/admin/register", async (req, res) => {
    try {
        const adminToken = req.cookies.token;
        if (!adminToken) {
            throw new Error("Token in not present");
        }
        const payload = jwt.verify(adminToken, process.env.SECRET_KEY)
        const isBlocked = await client.get(`token:${adminToken}`);
        if (isBlocked) {
            return res.status(403).send("Token is blocked (logged out)");
        }
        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        if(user.user !== "admin"){
            throw new Error("This in not admin");
        }
        const newAdmin = req.body;
        console.log(newAdmin);
        validateDetails(newAdmin);
        newAdmin.password = await bcrypt.hash(newAdmin.password, 10);
        newAdmin.user = newAdmin.user;
        await User.create(newAdmin);
        res.status(200).send("New admin added");
    }
    catch (err) {
        res.send(err.message);
    }
})

userRouter.delete("/deleteProfile", userValidate, async (req, res) => {
    try{
        const userId = req.body.userId;
        console.log(userId);
        await User.findByIdAndDelete(userId);
        await submission.deleteMany({userId});
        res.status(200).send("Profile deleted succesfully");
    }
    catch(err){
        res.status(400).send("unable to delete the profile");
    }
})


userRouter.get("/getSubmission/:pid", userValidate, async(req, res) => {
    try{
        const pid = req.params.pid;
        const userId = req.body.userId;
        const data = await submission.find({userId: userId, problemId: pid});
        if(data.length == 0){
            res.status(200).send("No data present");
        }
        res.status(200).send(data);
    }
    catch(err){
        res.status(400).send("Error fetching the submissions");
    }
})

userRouter.get("/check", userValidate, async (req, res) => {
    const userId = req.body.userId;
    console.log(userId)
    const userData = await User.findById(userId);
    const reply = {
        name: userData.name,
        id: userData._id,
        email: userData.email
    }
    res.status(201).json({
        user: reply,
        message: "user valid"
    })
})



module.exports = userRouter;