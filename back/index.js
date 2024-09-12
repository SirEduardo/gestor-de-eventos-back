require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { connectDB } = require("./src/config/db")
const cloudinary = require("cloudinary").v2
const eventRoutes = require("./src/api/routes/events")
const attendeeRoutes = require("./src/api/routes/attendees")
const authRoutes = require("./src/api/routes/auth")
const userRoutes = require("./src/api/routes/users")

const app = express()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

app.use(express.json())
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    optionsSuccessStatus: 200
  };
  
app.use(cors(corsOptions));

connectDB()

app.use("/api/v1/events", eventRoutes)

app.use("/api/v1/attendees", attendeeRoutes)

app.use("/api/v1/auth", authRoutes)

app.use("/api/v1/users", userRoutes)

app.use("*", (req, res, next) =>{
    return res.status(404).json("Route not found")
})

const port =  3000

app.listen(port, () => {
    console.log("Servidor levantado en: http://localhost:3000");
})
