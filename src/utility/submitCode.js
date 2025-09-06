const axios = require("axios");

const submitCode = async (submission) => {
    const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: { 
            base64_encoded: "false",   
            wait: "false"              
        },
        headers: {
            "x-rapidapi-key": process.env.JUDGE_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        },
        data: {
            submissions: submission
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("SubmitCode Error:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = submitCode;
