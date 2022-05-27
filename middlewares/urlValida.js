const { redirect } = require("express/lib/response");
const { URL } = require("url");

const urlValidar = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);
        if (urlFrontend.origin !== "null") {
            if (urlFrontend.protocol === "http:" || urlFrontend.protocol === "https:") {
                return next();
            }else{
                throw new Error("Tiene que tener https://");
            }

        } else {
            throw new Error("No válida 😲");
        }

    } catch (error) {
        //crear mensaje flash
        if (error.message === "Invalid URL") {
            req.flash("mensajes", [{ msg: "Url no valida" }]);
        } else {
            req.flash("mensajes", [{ msg: error.message }]);
        }
        return res.redirect("/");
    }
};
// exportar validacion url
module.exports = urlValidar;