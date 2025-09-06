const getLanguageById = require("./getLanguageById")
const submitCode = require("./submitCode");
const submitToken = require("./submitToken");


const codeSubmitionVerify = async (Solution, visibleTestCases) => {
    const { language, completeCode } = Solution 
        const lang_id = getLanguageById(language);
        const submission = visibleTestCases.map((testCases) => ({
            language_id: lang_id,
            source_code: completeCode,
            stdin: testCases.input,
            expected_output: testCases.output
        }));
        const submitionResult = await submitCode(submission);
        const resultTokens = submitionResult.map((value) => value.token);
        const testResult = await submitToken(resultTokens);
        return testResult;
}

module.exports = codeSubmitionVerify;
