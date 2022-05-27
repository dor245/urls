//importar formidable
const formidable = require("formidable");
//importar jimp
const jimp = require("jimp");
//importar path
const path = require("path");
//importar fs
const fs = require("fs");
const User = require("../models/user");
const formPerfil = async (req, res) => {
    try {
    const user = await User.findById(req.user.id);
    return res.render("perfil", { user: req.user, imagen: user.imagen});
  
    } catch (error) {
        req.flash("mensajes", [{ msg: "Error al comprobar el usuario" }]);
        return res.redirect("/user/perfil");
    }
    
}
const editarFotoPerfil = async (req, res) => {
    //nueva instancia
    const form = new formidable.IncomingForm();
    //tamaño maximo
    form.maxFileSize = 50 * 1024 * 1024;
    //procesar img
    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                throw new Error("Fallo al subir la imagen");
            } else {
                console.log(files);
                //capturar foto subida
                const file = files.myFile;
                //formatos aceptados
                const imagesTypes = ["image/jpeg", "image/png"]
                //no se ha adjuntado archivo
                if (file.originalFilename === "") {
                    throw new Error("No se ha agregado ninguna imagen, para su subida");
                }
                //formato img
                if (!imagesTypes.includes(file.mimetype)) {
                    throw new Error("Suba un archivo jpeg o png");
                }
                //tamaño img
                if (file.size > 50 * 1024 * 1024) {
                    throw new Error("Suba un archivo menor a 5MB");
                }
                //Imagen validada => extraer extension y directorio de guardado
                const extension = file.mimetype.split("/")[1];
                const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`);
                //redimensionar img
                fs.renameSync(file.filepath, dirFile);
                const image = await jimp.read(dirFile);
                image.resize(200, 200).quality(90).writeAsync(dirFile);
                //guardar img
                const user = await User.findById(req.user.id);
                user.imagen = `${req.user.id}.${extension}`;
                await user.save();
                req.flash("mensajes", [{ msg: "Imagen subida" }]);
            }
        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }]);
        } finally {
            return res.redirect("/user/perfil");
        }
    });
}
module.exports = {
    formPerfil,
    editarFotoPerfil
}