const jwt = require("jsonwebtoken");
const client = require('../redis/redisLogin');
const User = require('../config/userSchema');

async function adminValidate(req, res, next) {
    try {
        const adminToken = req.cookies.token;
        if (!adminToken) {
            return res.send("login again")
        }
        const valid = jwt.verify(adminToken, process.env.SECRET_KEY);
        if(!valid){
            throw new Error("login again")
        }
        const isBlocked = await client.get(`token:${adminToken}`);
        if (isBlocked === "blocked") {
            return res.send("login again")
        }
        const result = await User.findById(valid.id);
        if(result.user != "admin"){
            return res.send("your are not admin");
        }
        req.result = result;
        next();
    }
    catch (err) {
        res.send(err.message);
    }

}

module.exports = adminValidate;
