const express = require("express");
const { redirect } = require("express/lib/response");
//importar funciones desde su controlador
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionamiento } = require("../controllers/homeController");
//validar url
const urlValidar= require("../middlewares/urlValida");
const verificarUser = require("../middlewares/verificarUser");
//hacer uso de router
const router = express.Router();
//definir ruta
//Definicion ruta raiz mediante metodo get
router.get("/", verificarUser, leerUrls);
//Definicion de ruta agregar Url mediante post
router.post("/", verificarUser, urlValidar, agregarUrl);
//Definicion ruta eliminar/ :parametro
router.get("/eliminar/:id", verificarUser, eliminarUrl);
//Definicion ruta editar => mostrar formulario de edicion
router.get("/editar/:id", verificarUser, editarUrlForm);
//definiicion ruta editar
router.post("/editar/:id", verificarUser, urlValidar, editarUrl);
//definicion ruta copiar
router.get("/:shortUrl", redireccionamiento);
//exportar router
module.exports = router;