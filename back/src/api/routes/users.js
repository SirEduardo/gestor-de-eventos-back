const { isAuth } = require("../../middlewares/auth")

const { createEvent } = require("../controllers/events")
const { getUsers } = require("../controllers/users")

const userRoutes = require("express").Router()

userRoutes.post("/events", [isAuth], createEvent)
userRoutes.get("/", getUsers)


module.exports = userRoutes