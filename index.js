import express from "express"
import mongoose from "mongoose"
import 'dotenv/config'
import { registerValidation } from "./validations/auth.js"
import checkAuth from "./utils/checkAuth.js"
import * as UserControllers from './controllers/UserController.js'

const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL)
.then(() => console.log('DB connected'))
.catch((err) => console.log('Error', err))

const app = express()

app.use(express.json())

app.post('/auth/login', UserControllers.login)

app.post('/auth/register', registerValidation, UserControllers.register)

app.get('/auth/me', checkAuth, UserControllers.authMe)

app.listen(4000, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log('Server OK, 200')
})