const codeSubmitionVerify = require("../utility/codeSubmitionVerify");
const express = require("express");
const problemSubmition = express.Router();
const userValidate = require("../middleware/userValidate");
// const getLanguageById = require("../utility/getLanguageById")
const Problem = require("../config/problemSchema");
const Submission = require("../config/submissionSchema");
const User = require("../config/userSchema")
const getLanguageById = require("../utility/getLanguageById")




problemSubmition.post("/run/:id", userValidate, async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).send("Problem not found");
        }
        const { visibleTestCases } = problem;
        const { userId, Solution } = req.body;
        if (!Solution || !Solution.completeCode) {
            return res.status(400).json({ success: false, message: "Invalid solution format" });
        }
        const testResult = await codeSubmitionVerify(Solution, visibleTestCases);
        
        for (const test of testResult) {
            if (test.status_id != 3) {
                throw new Error("solution is wrong");
            }
        }
        res.send("accepted");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

problemSubmition.post("/submit/:id", userValidate, async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).send("Problem not found");
        }
        const { visibleTestCases, hiddenTestCases } = problem;
        const allTestCases = [...visibleTestCases, ...hiddenTestCases]
        const { userId, Solution } = req.body;
        if (!Solution || !Solution.completeCode) {
            return res.status(400).json({ success: false, message: "Invalid solution format" });
        }
        const testResult = await codeSubmitionVerify(Solution, allTestCases);
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted";
        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            }
            else {
                status = test.stderr
            }
        }
        const data = {
            userId: userId,
            problemId: id,
            code: Solution.completeCode,
            language: Solution.language,
            runtime: runtime,
            memory: memory,
            testCasesPassed: testCasesPassed,
            testCasesTotal: allTestCases.length
        }
        await Submission.create(data);
        const user = await User.findById(userId);
        if (user) {
            if (!user.problemSolved.includes(id)) {
                user.problemSolved.push(id);
                await user.save();
            }
        }
        res.send("code ran");
    } catch (err) {
        res.status(500).send(err.message);
    }
});
module.exports = problemSubmition;
