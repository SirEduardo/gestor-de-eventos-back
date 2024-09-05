const User = require("../api/models/users")
const { verifyToken } = require("../utils/token")

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        
        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" })
        }

        const parsedToken = token.replace("Bearer ", "")
        const decodedToken = verifyToken(parsedToken);

        if (!decodedToken.id) {
            return res.status(401).json({ message: "Token no válido" })
        }

        const user = await User.findById(decodedToken.id)

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" })
        }

        user.password = undefined
        req.user = user
        next()
    } catch (error) {
        console.error("Error en el middleware de autenticación:", error)
        return res.status(401).json({ message: "Unauthorized" })
    }
};

module.exports = { isAuth }
