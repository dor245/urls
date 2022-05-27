//importar paquete bcryptjs
const bcrypt = require("bcryptjs");
//importar paquete de mongoose
const mongoose = require("mongoose");
//llamada a schema de mongoose
const { Schema } = mongoose;
// instacia del schema // definicion de propiedades
const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    //para mensaje de confirmacion al correo
    tokenConfirm: {
        type: String,
        default: null
    },
    cuentaConfirmada: {
        type: Boolean,
        default: false
    },
    imagen: {
        type: String,
        default: null,
    }
});
//encriptado contraseña
userSchema.pre("save", async function(next) {
    const profile= this;
    if (!profile.isModified("password")) {
        return next();
    }else{
        try {   
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(profile.password, salt);
        profile.password=hash;
        next();
        } catch (error) {
            /* por si falla la encriptacion de contraseña => profile = null*/
            console.log(error);
            throw new Error("Error en la codificacion de la clave");
        }
    }
});
//comparacion de contrasenas => login
userSchema.methods.comparePassword = async function (candidatePassword) {
    const profile = this;
    return await bcrypt.compare(candidatePassword, profile.password);
}
//exportar directamemte el esquema 
module.exports = mongoose.model("User", userSchema);
