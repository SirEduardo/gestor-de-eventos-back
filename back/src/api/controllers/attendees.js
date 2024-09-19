const Attendee = require("../models/attendees")
const User = require("../models/users")

const getAttendees = async (req, res, next) => {
    try {
        const attendees = await Attendee.find().populate("events")
        return res.status(200).json(attendees)
    } catch (error) {
        return res.status(400).json({ message: "Error al recoger asistentes", error })
    }
}

const getAttendeeById = async (req, res, next) => {
    try {
        const { email } = req.params;
        const normalizedEmail = email.toLowerCase()
        const attendee = await User.findOne({ email: normalizedEmail }).populate("events")

        if (!attendee) {
            return res.status(404).json({ message: "Asistente no encontrado" });
        }
        return res.status(200).json(attendee);
    } catch (error) {
        console.error('Error al encontrar al asistente:', error);
        return res.status(500).json({ message: "Error al encontrar al asistente", error });
    }
}

const confirmAttendance = async (req, res) => {
    try {        
        const { eventId } = req.params
        let attendee = await User.findOne({ email:req.user.email })
        if (!attendee) {
            attendee = new Attendee({ name: req.user.userName, email: req.user.email, events: [eventId] })
        } else {
            if (!attendee.events.includes(eventId)) {
                attendee.events.push(eventId);
            } else {
                return res.status(400).json({ message: "Asistencia ya confirmada" })
            }
        }
        await attendee.save()
        return res.status(200).json(attendee)
    } catch (error) {
        return res.status(500).json({ message: "Error confirmando asistencia", error })
    }
}


const deleteAttendance = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Usuario no autenticado" })
        }

        const { eventId } = req.params
        const { email } = req.user

        if (!email) {
            return res.status(400).json({ message: "Email del usuario no disponible" })
        }
        let attendee = await User.findOne({ email })

        if (!attendee) {
            return res.status(400).json({ message: "No se encontró al usuario" })
        }
        if (!attendee.events.includes(eventId)) {
            return res.status(400).json({ message: "Asistencia no confirmada" })
        }

        attendee.events = attendee.events.filter(event => event.toString() !== eventId)
        await attendee.save()
        return res.status(200).json(attendee)
    } catch (error) {
        console.error("Error eliminando asistencia:", error)
        return res.status(500).json({ message: "Error eliminando asistencia", error })
    }
}
module.exports = { getAttendees, getAttendeeById, confirmAttendance, deleteAttendance }