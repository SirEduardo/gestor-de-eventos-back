const { isAuth } = require("../../middlewares/auth")
const { getAttendees, getAttendeeById, confirmAttendance, deleteAttendance} = require("../controllers/attendees")

const attendeeRoutes = require("express").Router()


attendeeRoutes.get("/", getAttendees)
attendeeRoutes.get("/:email", getAttendeeById)
attendeeRoutes.post("/:eventId", [isAuth], confirmAttendance)
attendeeRoutes.delete("/:eventId", [isAuth], deleteAttendance)


module.exports = attendeeRoutes