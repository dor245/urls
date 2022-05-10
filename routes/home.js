const express = require("express");
//hacer uso de router
const router = express.Router();
//definir ruta
//Definicion ruta raiz mediante metodo get
router.get("/", (req, res) => {
    //simulacion BBDD
    const urls = [
        { img: "/img/loki.jpg", texto: "Loki", subtitulo: "Disponible en Disney +" },
        { img: "/img/cl.jpg", texto: "Caballero Luna", subtitulo: "Disponible en Disney +" },
        { img: "/img/wanda.jpg", texto: "Wanda Vision", subtitulo: "Disponible en Disney +" }

    ]
    //renderizar pagina // mandar datos para utilizarlos en la vista
    res.render("home", { urls: urls });
});
//exportar router
module.exports = router;