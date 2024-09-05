const { registerUser, loginUser } = require("../controllers/users")

const authRoutes = require("express").Router()


authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)


module.exports = authRoutes