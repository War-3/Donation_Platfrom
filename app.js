const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")

const allRouter = require('./routes/allRoutes')


const cors = require('cors')
const connectToDB = require("./db")



const PORT = process.env.PORT || 7080

connectToDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
//app.set("view engine", "ejs")
//app.set("views", path.join(__dirname, "views"))

app.listen(PORT, ()=>{
    console.log(`Server started Running on Port ${PORT}`)
})

app.get('/', (req, res)=>{
    return res.status(200).json({message: "Welcome! Safe a soul today with your Donation"})
})

  app.use("/api", allRouter)

app.use((req, res) => {
    res.status(404).json({
        message: "Welcome to our server, this endpoint does not exist!"
    })
})