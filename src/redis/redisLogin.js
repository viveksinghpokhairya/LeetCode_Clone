const {createClient} = require('redis');


const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11848.c274.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 11848
    }
});

module.exports = client;

