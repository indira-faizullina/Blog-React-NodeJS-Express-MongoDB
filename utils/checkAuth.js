import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_KEY = process.env.JWT_KEY

export default (req, res, next) => {

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if(token) {
        try {
            const decoded = jwt.verify(token, JWT_KEY)

            req.userId = decoded._id

            next()
        }
        catch(err) {
        return res.status(403).json({
            message: 'Нет доступа'
        })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}