const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        rol: { type: String, required: true, enum:["admin", "user"] }
    },
    {
        timestamps: true,
        collection: "users"
    }
)

userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})

const User = mongoose.model("users", userSchema, "users")
module.exports = User