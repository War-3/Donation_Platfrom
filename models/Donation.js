const mongoose = require("mongoose")
const Schema = mongoose.Schema

const donationSchema = new Schema({
    donor: {  type: Schema.Types.ObjectId,ref: "User",required: true},
    cause: {type: Schema.Types.ObjectId,ref: "Cause",required: true,},
    amount: {type: Number,required: true},
    status: {type: String, enum: ["pending", "completed", "failed"],default: "pending"},
    paymentReference: {type: String,required: function () {return this.status === "completed"}},    
    createdAt: {type: Date,default: Date.now},
})


module.exports = mongoose.model("Donation", donationSchema)