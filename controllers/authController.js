const User = require("../models/user");
//importar express validator
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");
const session = require("express-session");
require("dotenv").config();
//importar nodemailer
const nodemailer = require("nodemailer");
//inicio sesion
const loginForm = (req, res) => {
    res.render("login");
}
//inicio sesion usuario
const loginUser = async (req, res) => {
    //validacion
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/login");
    }
    //sacar datos formulario
    const { email, password } = req.body;
    try {
        //existe usuario
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("No existe este email");
        }
        if (!user.cuentaConfirmada) {
            throw new Error("Error de confirmacion de cuenta");
        }
        if (!await user.comparePassword(password)) {
            throw new Error("Error clave incorrecta");
        }
        //crear la sesion de usuario por passport
        req.login(user, function(err){
            if (err) {
                throw new Error("Error al crear la sesion");
            }else{
                return res.redirect("/");
            }
        });
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/login");
    }
}

//funcion cerrar sesion
/*const cerrarSesion = (req, res) => {
    //metodo logout al igual que login => passport
    req.logout();
    return res.redirect("/auth/login");
}*/
//registro
const registerForm = (req, res) => {
    res.render("register");
}

//importar registro a la BBDD
const registerUser = async (req, res) => {
    //validar nombre
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/register");
    }
    //recoger datos del formulario de registro
    const { userName, email, password } = req.body;
    try {
        //propiedad - valor
        let user = await User.findOne({ email: email });
        // manejo de errores - salta directo al error
        if (user) {
            throw new Error("Este usuario ya existe");
        }
        //registro usuario
        user = new User({ userName, email, password, tokenConfirm: nanoid() });
        //guardar usuario
        await user.save();

        //correoConfirmacion
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.userEmail,
              pass: process.env.passEmail
            }
          });
          await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: user.email,
            subject: "verifique cuenta de correo",
            html: `<a href="${process.env.PATHHEROKU || process.env.LOCALHOST}${process.env.rutaEmail}${user.tokenConfirm}">verificar cuenta aquí</a>`,
        });
        req.flash("mensajes", [{msg: "Debe confirmar su cuenta desde el correo electronico"}]);
        return res.redirect("/auth/login");
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/register");
    }
}
const confirmarCuenta = async (req, res) => {
    // leer parametros de url
    const { token } = req.params;
    // validar
    try {
        const user = await User.findOne({ tokenConfirm: token });
        if (!user) {
            throw new Error("Este usuario no existe");
        } else {
            user.cuentaConfirmada = true;
            user.tokenConfirm = null;
            await user.save();
            //mensaje verificacion
            req.flash("mensajes", [
                {msg: "Cuenta verificada"}
            ]);
            res.redirect("/auth/login");
        }

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/login");
    }
}
//alternativa cerrar sesion
cerrarSesiones = (req, res) => {
    req.session.destroy();
    return res.redirect("/auth/login");

};

//exportar funciones
module.exports = {
    loginForm,
    loginUser,
   // cerrarSesion,
    registerForm,
    registerUser,
    confirmarCuenta,
    cerrarSesiones
}