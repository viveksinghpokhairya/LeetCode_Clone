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


// language_id: 54,
//     stdin: 'madam',
//     expected_output: 'YES',
//     stdout: 'YES\n',
//     status_id: 3,
//     created_at: '2025-08-27T12:44:21.902Z',
//     finished_at: '2025-08-27T12:44:23.003Z',
//     time: '0.002',
//     memory: 1072,
//     stderr: null,