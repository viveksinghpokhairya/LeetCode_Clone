const validate = require("validator");

function validateDetails(userData) {
    const mandatoryDetails = ["name", "email", "password"];
    const missingFields = mandatoryDetails.filter((k) => !Object.keys(userData).includes(k));
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
    if (!(userData.name.length >= 3 && userData.name.length <= 15)) {
        throw new Error("Name length should be between 3 and 15");
    }
    if (!(validate.isEmail(userData.email))) {
        throw new Error("not a valid email");
    }
    if (!(validate.isStrongPassword(userData.password))) {
        throw new Error("not Strong Password");
    }
}

module.exports = validateDetails;