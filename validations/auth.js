import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 6 символов').isLength({min: 6}),
    body('fullName', 'Введите корректное имя. Не менее 2 символов').isLength({min: 2}),
    body('avatarUrl', 'Неверная ссылка на аватарку, укажите корректный URL').optional().isURL()
]