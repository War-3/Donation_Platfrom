const jwt = require('jsonwebtoken');
const User = require("../models/User")

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied!" })
    }
    const authHeaderParts = authHeader.split(" ")

    if (authHeaderParts.length !== 2) {
            return res.status(401).json({ message: "Invalid Authorization header format" })
    }

    const token = authHeaderParts[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
          
    console.log({ decoded })

    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" })
    }

    const user = await User.findOne({ username: decoded.user.email })

    if (!user) {
        return res.status(400).json({ message: "User account not found!" })
    }
        
    req.user = user; 

    next();

    } catch (error) {
      return res.status(500).json({ message: error.message})
    }
  
}



module.exports = {authenticateJWT};