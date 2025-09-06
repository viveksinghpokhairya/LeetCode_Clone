require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const database = require("./config/db");
// const User = require("./cofig/userSchema");
const userRouter = require('./routes/user');
const AIrouter = require("./routes/genai")
const client = require("./redis/redisLogin")
const problemRouter = require("./routes/problemCreation");
const problemAccess = require("./routes/problemAccess")
const problemSubmition = require("./routes/problemSubmition")
const videoRouter = require("./routes/videoCreator")
const cors = require("cors");
const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/user", userRouter);
app.use("/problem", problemRouter);
app.use("/question", problemAccess);
app.use("/submission", problemSubmition);
app.use("/ai", AIrouter);
app.use("/video", videoRouter);

async function index() {
    try{
        await database();
        await client.connect();
        console.log("conneceted to redis")
        app.listen(process.env.PORT, () => {
            console.log("listening at port");
        })
    }
    catch(err){
        console.log(err.message);
    }
}

index();