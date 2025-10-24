import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 6 символов').isLength({min: 6})
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 6 символов').isLength({min: 6}),
    body('fullName', 'Введите корректное имя. Не менее 2 символов').isLength({min: 2}),
    body('avatarUrl', 'Неверная ссылка на аватарку, укажите корректный URL').optional().isURL()
]

export const postCreateValidation = [
    body('title', 'Введите корректный заголовок статьи').isLength({min: 3, max: 100}).isString(),
    body('text', 'Добавьте статью').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тегов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isURL()
]
