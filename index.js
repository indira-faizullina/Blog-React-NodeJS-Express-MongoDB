import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import multer from "multer"
import { PostController, UserController } from "./controllers/controllers.js"
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js"
import { checkAuth, handleValidationErrors } from "./utils/utils.js"

const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL)
.then(() => console.log('DB connected'))
.catch((err) => console.log('Error', err))

const app = express()
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({storage})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.authMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.status(200).json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(4000, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log('Server OK, 200')
})