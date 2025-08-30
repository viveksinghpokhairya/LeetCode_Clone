const {Schema, trusted, default: mongoose} = require("mongoose");

const problemSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    difficulty:{
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    tags:{
        type: String,
        enum: ["array", "linked list", "graph", "dp", "string"],
        required: true
    },
    visibleTestCases:[
        {
            input:{
                type: String,
                required: true
            },
            output:{
                type: String,
                required: true
            },
            explanation:{
                type: String,
                required: true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type: String,
                required: true
            },
            output:{
                type: String,
                required: true
            }
        }
    ],
    starterCode: [
        {
            language: {
                type: String,
                required: true
            },
            initialCode:{
                type: String,
                required: true
            }
        }
    ],
    Solution: [
        {
            language: {
                type: String,
                required: true
            },
            completeCode:{
                type: String,
                required: true
            }
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})



const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;