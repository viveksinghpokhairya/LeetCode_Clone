const jwt = require("jsonwebtoken")
const client = require('../redis/redisLogin');

const userValidate = async (req, res, next) => {
    try {
        const loginToken = req.cookies.token;
        if (!loginToken) {
            return res.status(401).send("No token provided");
        }
        const payload = jwt.verify(loginToken, process.env.SECRET_KEY);
        const isBlocked = await client.get(`token:${loginToken}`);
        if (isBlocked) {
            return res.status(403).send("Token is blocked (logged out)");
        }
        req.body = { ...req.body, userId: payload.id };
        next();
    } catch (err) {
        res.status(401).send({ error: err.message });
    }
}

module.exports = userValidate;