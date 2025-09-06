const express = require('express');
const adminValidate = require('../middleware/adminValidate');
const videoRouter = express.Router();
const { generateUploadSignature, saveVideoMetadata, deleteVideo } = require("../controllers/videoSection")

videoRouter.get("/create/:problemId", adminValidate, generateUploadSignature);
videoRouter.post("/save", adminValidate, saveVideoMetadata);
videoRouter.delete("/delete/:problemId", adminValidate, deleteVideo);


module.exports = videoRouter;