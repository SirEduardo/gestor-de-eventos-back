const mongoose = require("mongoose")

const attendeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }]
    },
    {
        collection: "attendees"
    }
)

const Attendee = mongoose.model("attendees", attendeeSchema, "attendees")
module.exports = Attendee