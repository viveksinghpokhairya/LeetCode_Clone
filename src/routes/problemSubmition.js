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
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time)
                memory = Math.max(memory, test.memory);
            } else {
                if (test.status_id == 4) {
                    status = false
                    errorMessage = test.stderr
                }
                else {
                    status = false
                    errorMessage = test.stderr
                }
            }
        }



        res.status(201).json({
            success: status,
            testCases: testResult,
            runtime,
            memory
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

problemSubmition.post("/submit/:id", userValidate, async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findById(id);
        console.log("submittion is called")
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
        let errorMessage = null;
        console.log("hello");
        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            }
            else {
                status = 'error'
                errorMessage = test.stderr
            }
        }
        const data = {
            userId: userId,
            problemId: id,
            code: Solution.completeCode,
            language: (Solution.language === "cpp" ? "c++" : Solution.language),
            runtime: runtime,
            memory: memory,
            testCasesPassed: testCasesPassed,
            testCasesTotal: allTestCases.length
        }
        const ans = await Submission.create(data);
        await Submission.findByIdAndUpdate(ans._id, {status: status}, {runValidators: true})
        console.log(ans);
        const user = await User.findById(userId);
        ;
        if (user) {
            if (!user.problemSolved.includes(id)) {
                user.problemSolved.push(id);
                await user.save();
            }
        }
        data.accepted = (status === "accepted" ? true : false);
        data.error = errorMessage;
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
module.exports = problemSubmition;
