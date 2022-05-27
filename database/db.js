//importar paquete de mongoose
const mongoose = require ("mongoose");
//importar variables de entorno
require("dotenv").config();
// conexion BBDD
const clientDB = mongoose
    .connect(process.env.URI)
    .then((m) => {
        console.log("BBDD CONECTADA")
        return m.connection.getClient()
    })
    .catch((e) => console.log("Error de conexion "+ e));
module.exports = clientDB;