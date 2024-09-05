const { deleteFile } = require("../../utils/deleteFiles");
const Event = require("../models/events");

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("createdBy", "userName");
    if (!events.length) {
      return res.status(404).json({ message: "No hay eventos disponibles" });
    }
    return res.status(200).json(events);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener eventos", error });
  }
};

const getEventsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json("Evento no encontrado");
    }
    return res.status(200).json(event);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error recogiendo el evento", error });
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, date, location, description } = req.body;
    const newEvent = new Event({ title, date, location, description, createdBy: req.user.id });
    if (req.file) {
      newEvent.img = req.file.path;
    }
    const event = await newEvent.save();
    return res.status(201).json(event);
  } catch (error) {
    return res.status(400).json({ message: "Error creando el evento", error });
  }
};

const deleteEvent = async (req, res, next) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);

    if (!event) {
        return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Otro usuario no puede eliminar este evento" });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);
    deleteFile(deletedEvent.img);
    return res.status(200).json(deletedEvent);
  } catch (error) {
    return res.status(400).json({ message: "Error al eliminar el evento" });
  }
};

module.exports = { getEvents, getEventsById, createEvent, deleteEvent };
