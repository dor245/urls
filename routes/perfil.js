//hacer uso de router
//importar paquete express
const express = require("express");
const router = express.Router();
//importar funciones controlador del perfil
const { formPerfil, editarFotoPerfil } = require("../controllers/perfilController");
//imprtar middleware verificarUser
const verificarUser = require("../middlewares/verificarUser");
router.get("/perfil", verificarUser, formPerfil);
router.post("/perfil", verificarUser, editarFotoPerfil);
//exportar router
module.exports = router;