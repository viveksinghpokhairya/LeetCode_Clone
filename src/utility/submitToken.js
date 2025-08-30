const axios = require('axios');

const wait = async (timer) => {
    setTimeout(() => {
        return 1;
    }, timer)
}
const submitToken = async (resultTokens) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultTokens.join(","),
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': '683857420emsha9085824a13f164p13a170jsn2a6d5f4d42ec',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    while (true) {
        const result = await fetchData()
        const resultObtained = result.submissions.every((r) => r.status_id >= 3);
        if (resultObtained) {
            return result.submissions;
        }
        await wait(1000);
    }
}

module.exports = submitToken;

