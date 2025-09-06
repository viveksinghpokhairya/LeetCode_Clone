const express = require("express");
const problemAccess = express.Router();
const Problem = require("../config/problemSchema");
const User = require("../config/userSchema")
const userValidate = require("../middleware/userValidate");
const adminValidate = require("../middleware/adminValidate")
const SolutionVideo = require("../config/videoSchema");

problemAccess.get("/all", userValidate, async (req, res) => {
    try {
        const getAllProblem = await Problem.find({}).select("_id title difficulty tags");
        if (getAllProblem.length == 0) {
            return res.status(400).send("Unable to fetch the problems");
        }
        res.status(200).send(getAllProblem);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

problemAccess.get("/getAllProblemsSolved", userValidate, async (req, res) => {
    try {
        const userId = req.body.userId;
        // console.log(userId);
        const Data = await User.findById(userId).select("problemSolved");
        if (!Data) {
            res.status(400).send("unable to access the problems");
        }
        res.status(200).send(Data.problemSolved);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

problemAccess.get("/:id", userValidate, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("problem is being called")
        if (!id) {
            return res.status(400).send("invalid problem id");
        }
        const problem = await Problem.findById(id).select("title description difficulty tags visibleTestCases starterCode Solution");

        if (!problem) {
            throw new Error("unable to get the problem");
        }

        const videoLink = await SolutionVideo.findOne({ problemId: id });
        console.log(videoLink)
        if (videoLink) {
            const responseData = {
                ...problem.toObject(),
                cloudinaryPublicId: videoLink.cloudinaryPublicId,
                secureUrl: videoLink.secureUrl,
                thumbnailUrl: videoLink.thumbnailUrl,
                duration: videoLink.duration,
            }

            // console.log("this is the problem link", problem.duration)
            return res.status(200).send(responseData);
        }
        res.status(200).send(problem);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

problemAccess.get("/admin/:id", adminValidate, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("invalid problem id");
        }
        const problem = await Problem.findById(id)
        if (!problem) {
            throw new Error("unable to get the problem");
        }
        res.status(200).send(problem);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})





module.exports = problemAccess;