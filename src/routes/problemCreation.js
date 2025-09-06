const express = require("express");
const problemRouter = express.Router();
const adminValidate = require("../middleware/adminValidate")
const getLanguageById = require("../utility/getLanguageById");

const Problem = require("../config/problemSchema");
const codeVerify = require("../utility/codeVerify")


//problem creation
problemRouter.post("/create", adminValidate, async (req, res) => {
    try {
        const { visibleTestCases, Solution } = req.body;
        const correctCode = await codeVerify(Solution, visibleTestCases);
        if (!correctCode) {
            return res.status(400).send("Wrong Code");
        }
        await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        })
        res.status(201).send("problem saved successfully");
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})


problemRouter.post("/update/:id", adminValidate, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("invalid problem id");
        }
        const { title, description, difficulty, tags,
            visibleTestCases, hiddenTestCases,
            starterCode, Solution, problemCreator } = req.body;
        const correctCode = await codeVerify(Solution, visibleTestCases);
        if (!correctCode) {
            return res.status(400).send("Wrong Solution for the problem");
        }
        await Problem.findByIdAndUpdate(id, {
            ...req.body
        }, { runValidators: true });
        res.status(200).send("problem updated");
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})


problemRouter.delete(("/delete/:id"), adminValidate, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("invalid problem id");
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if (!deletedProblem) {
            return res.status(400).send("unable to delete the problem");
        }
        res.status(200).send("problem deleted");
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = problemRouter;