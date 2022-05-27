//importar modelo de url.js
const Url = require("../models/url");
//importar/llamada a nanoid
const { nanoid } = require("nanoid");
const res = require("express/lib/response");
// async para la lectura desde BBDD // READ
const leerUrls = async (req, res) => {
    //traer datos de BBDD
    try {
        //traer modelo // {} paa dato concreto // lean para que sea leible por la vista (html)
        const urls = await Url.find({user: req.user.id}).lean();
        //renderizar pagina // mandar datos para utilizarlos en la vista     
        res.render("home", { urls: urls });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
}
//funcion asincrona agregar URL// CREATE
const agregarUrl = async (req, res) => {
    const { origin } = req.body;
    try {
        //instancia de una URL
        const url = new Url({ origin: origin, shortUrl: nanoid(8), user: req.user.id });
        //Guardar en BBDD
        await url.save();
        req.flash("mensajes", [{ msg: "URL agregada" }]);
        //redirigir a la pagina home
        res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
}
const eliminarUrl = async (req, res) => {
    //destructurar para coger el parametro id
    const { id } = req.params;
    try {
        //metodo de eliminacion para mongo
       const url = await Url.findById(id);
       if (!url.user.equals(req.user.id)) {
           throw new Error ("Esta URL no te pertenece");
       }else{
           //borrar URL
           await url.remove();
           //mensaje flash operacion correcta
           req.flash("mensajes", [{ msg: "URL eliminada"}]);
           return res.redirect("/");       
       }

    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
}
//UPDATE => Formulario
const editarUrlForm = async (req, res) => {
    //destructurar para coger el parametro id
    const { id } = req.params;
    try {
        url = await Url.findById(id).lean();
        if (!url.user.equals(req.user.id)) {
            throw new Error ("Esta URL no te pertenece");
        }else{
            return res.render("home", {url});            
        }

    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
}
// UPDATE
const editarUrl = async (req, res) => {
    //destructurar para coger el parametro id
    const { id } = req.params;
    //coger url del formulario
    const {origin}= req.body;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error ("Esta URL no te pertenece");
        }else{
            await url.updateOne({origin});
            req.flash("mensajes", [{msg: "URL editada"}]);
            return res.redirect("/");
        }
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
}
//COPY
const redireccionamiento= async (req, res) =>{
    const {shortUrl}= req.params;
    try {
       const urlDB= await Url.findOne({shortUrl}); 
       return res.redirect(urlDB.origin);
    } catch (error) {
        req.flash("mensajes", [{ msg: "No exite esta URL "}]);
        return res.redirect("/auth/login");
    }
}
// exportar como objeto para tener varios metodos
module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento
}