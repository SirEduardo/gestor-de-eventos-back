const { generateToken } = require("../../utils/token")
const bcrypt = require("bcrypt")
const User = require("../models/users")

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(400).json("Error al recoger usuarios")
    }
}

const registerUser = async (req, res, next) => {
    try {
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            rol: "user"        
        })
        const userExist = await User.findOne({email: req.body.email})
        if (userExist) {
            return res.status(409).json("Este usuario ya existe")
        }
        const userSaved = await newUser.save()
        return res.status(201).json(userSaved)
    } catch (error) {
        return res.status(400).json("Error al registrar al usuario")
    }
}

const loginUser = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(400).json("Usuario no encontrado")
        }
        if(bcrypt.compareSync(req.body.password, user.password)){
            const token = generateToken(user._id)            
            return res.status(200).json({ user, token })
        }
        return res.status(400).json("Usuario o contraseña incorrectos")
    } catch (error) {
        return res.status(400).json("Error en el login")
    }
}

module.exports = { getUsers ,registerUser, loginUser }