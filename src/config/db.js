const mongoose = require("mongoose");

async function database() {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_STRING_USER);
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports = database;