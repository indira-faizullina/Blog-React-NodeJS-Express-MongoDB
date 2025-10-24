import express from "express"
import mongoose from "mongoose"
import 'dotenv/config'
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js"
import checkAuth from "./utils/checkAuth.js"
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL)
.then(() => console.log('DB connected'))
.catch((err) => console.log('Error', err))

const app = express()

app.use(express.json())

app.post('/auth/login', loginValidation, UserController.login)

app.post('/auth/register', registerValidation, UserController.register)

app.get('/auth/me', checkAuth, UserController.authMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(4000, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log('Server OK, 200')
})