const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true  },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, Enumerator: ["donor", "organizer"], default:"Donor", required: true },
    createdAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model("User", UserSchema)