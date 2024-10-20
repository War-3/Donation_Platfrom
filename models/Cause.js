const mongoose = require("mongoose")
const Schema = mongoose.Schema

const causeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true},
    goal_amount: {type: Number,required: true, minimum: 0 },
    raised_amount: { type: Number, default: 0, minimum: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    created_at: {type: Date, default: Date.now }
})



module.exports = mongoose.model("Cause", causeSchema)