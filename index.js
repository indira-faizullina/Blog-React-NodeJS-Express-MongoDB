import express from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import 'dotenv/config'
import { validationResult } from "express-validator"
import { registerValidation } from "./validations/auth.js"
import UserModel from "./models/User.js"

const DB_URL = process.env.DB_URL
const JWT_KEY = process.env.JWT_KEY

mongoose.connect(DB_URL)
.then(() => console.log('DB connected'))
.catch((err) => console.log('Error', err))

const app = express()

app.use(express.json())

app.post('/auth/login', async(req, res) => {
    try {
        const user = await UserModel.findOne( {email: req.body.email} )

        if(!user) {
            res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const isValidePassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidePassword) {
            res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
            _id: user._id
        },
        JWT_KEY,
        {
            expiresIn: '30d'
        })

        const { passwordHash, ...userData } = user._doc

        return res.json({
            ...userData,
            token,
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться.'
        })
    }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        },
        JWT_KEY,
        {
            expiresIn: '30d'
        })

        const { passwordHash, ...userData } = user._doc

        return res.json({
            ...userData,
            token,
        })
    } 
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться.'
        })
    }
})

app.listen(4000, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log('Server OK, 200')
})