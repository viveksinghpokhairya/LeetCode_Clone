const express = require("express");
const problemAccess = express.Router();
const Problem = require("../config/problemSchema");
const User = require("../config/userSchema")
const userValidate = require("../middleware/userValidate");

problemAccess.get("/all", userValidate, async (req, res) => {
    try{
        const getAllProblem = await Problem.find({}).select("_id title difficulty tags");
        if(getAllProblem.length == 0){
            return res.status(400).send("Unable to fetch the problems");
        }
        res.status(200).send(getAllProblem);
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

problemAccess.get("/getAllProblemsSolved",userValidate, async (req, res) => {
    try{
        const userId = req.body.userId;
        console.log(req.body)
        console.log(userId)
        const data = await User.findById(userId).populate("problemSolved");
        console.log(data);
        if(!data){
            res.status(400).send("unable to access the problems");
        } 
        res.status(200).send(data);
    }       
    catch(err){
        res.status(400).send(err.message);
    }
})

problemAccess.get("/:id", userValidate, async (req, res) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("invalid problem id");
        }
        const problem = await Problem.findById(id).select("title description difficulty tags visibleTestCases starterCode Solution");
        if (!problem) {
            throw new Error("unable to get the problem");
        }
        res.status(200).send(problem);
    }
    catch(err){
        res.status(400).send(err.message);
    }
})




module.exports = problemAccess;