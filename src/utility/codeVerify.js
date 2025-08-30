const getLanguageById = require("./getLanguageById")
const submitCode = require("./submitCode");
const submitToken = require("./submitToken");

const codeVerify = async (Solution, visibleTestCases) => {
    for (const { language, completeCode } of Solution) {
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
        console.log(testResult);
        
        for (const test of testResult) {
            if (test.status_id != 3) {
                return false;
            }
        }
    }
    return true;
}

module.exports = codeVerify;