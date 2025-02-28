const { check, body } = require('express-validator');

const db = require('../database/models');
module.exports = [
    check('firstName')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min: 2
        }).withMessage('Mínimo dos letras').bail()
        .isAlpha('es-ES', {
            ignore: " "
        }).withMessage('Solo caracteres alfabéticos'),

    check('LastName')
        .notEmpty().withMessage('El apellido es obligatorio').bail()
        .isLength({
            min: 2
        }).withMessage('Mínimo dos letras').bail()
        .isAlpha('es-ES', {
            ignore: " "
        }).withMessage('Solo caracteres alfabéticos'),

    check('userName')
        .notEmpty().withMessage('Debes escribir un usuario').bail()
        .isLength({
            min: 2
        }).withMessage('Mínimo dos letras').bail()
        .custom((value, {req}) => { 
            return db.User.findOne({
            where : {
                userName : value
            }
        }).then(user => {
            if(user){
                return Promise.reject()
            }
        }).catch((error) => {
            console.log(error)
            return Promise.reject('El usuario ya se encuentra registrado')
        })
    }),

    body('email')
        .notEmpty().withMessage('El email es obligatorio').bail()
        .isEmail().withMessage('Debe ser un email con formato válido')
        .custom((value, {req}) => {
            return db.User.findOne({
                where : {
                    email : value
                }
            }).then(user => {
                if(user){
                    return Promise.reject()
                }
            }).catch((error) => {
                console.log(error)
                return Promise.reject('El email ya se encuentra registrado')
            })
        }),

    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria').bail()
        .isLength({
            min: 6,
            max: 12
        }).withMessage('La contraseña debe tener entre 6 y 12 caracteres'),

    body('password2')
        .notEmpty().withMessage('Debes confirmar tu contraseña').bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false
            }
            return true
        }).withMessage('Las contraseñas no coinciden')


]