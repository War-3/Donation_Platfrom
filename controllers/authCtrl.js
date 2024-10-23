const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")



exports.registerFxn = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).send("All fields (name, email, password, role) are required.")
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).send("User already exists")
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = new User({name,email,password: hashedPassword,role})

        await newUser.save()
        return res.status(200).json({
            message: "Registration Successful",
            user: newUser
        });
        
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error")
    }
}

exports.loginFxn = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password"})
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password"})
        }

        const accessToken = jwt.sign({user},   `${process.env.ACCESS_TOKEN}`, { expiresIn: '20m' });
        const refreshToken = jwt.sign({user}, `${process.env.REFRESH_TOKEN}`, {expiresIn: "1d"})

        res.status(200).json({ message: "Login successful", accessToken, user})
    }   catch (error) {
        res.status(500).json({ error: "Login failed, try again"})
    }

}


