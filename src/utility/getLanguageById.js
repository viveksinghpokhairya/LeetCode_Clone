const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "cpp": 54,
        "c": 50,
        "python": 109,
        "java": 91,
        "javascript": 102
    }
    return language[lang.toLowerCase()];

}

module.exports = getLanguageById;