const express = require("express");
//importar express-validator
const { body } = require("express-validator");
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesiones } = require("../controllers/authController");
//hacer uso de router
const router = express.Router();
//Definicion ruta /register mediante metodo get
router.get("/register", registerForm);
//Definicion guardado de datos de registro // name del formulario de registro
router.post("/register", [
    body("userName", "Introduzca un nombre valido").trim().notEmpty().escape(),
    body("email", "Introduzca un email valido").trim().isEmail().normalizeEmail(),
    body("password", "Clave de 6 caracteres").trim().isLength({ min: 6 }).escape().custom((value, { req }) => {
        if (value !== req.body.repassword) {
            throw new Error("No coinciden las claves");
        } else {
            return value;
        }
    })
], registerUser);
//Definicion ruta /login mediante metodo get
router.get("/login", loginForm);
//Definicion ruta /login mediante metodo post => inicio
router.post("/login", [
    body("email", "Introduzca un email valido").trim().isEmail().normalizeEmail(),
    body("password", "Clave de 6 caracteres").trim().isLength({ min: 6 }).escape()
], loginUser);
//ruta confirmacion de cuenta
router.get("/confirmar/:token", confirmarCuenta);
//ruta cerrar sesion
router.get("/logout", cerrarSesiones);
//exportar router
module.exports = router;