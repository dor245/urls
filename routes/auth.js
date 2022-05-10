const express = require("express");
//hacer uso de router
const router = express.Router();
//Definicion ruta /login mediante metodo get
router.get("/login", (req, res) => {
    //renderizar pagina
    res.render("login");
});
//exportar router
module.exports = router;