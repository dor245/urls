//importar paquete express
const express = require("express");
//importar paquete express-handlebars
const { create } = require("express-handlebars");
//instanciar aplicacion
const app = express();
//definir puerto
const port = process.env.PORT;
//acceder a la configuracion de archivos handlebars => cambiar extension
const hbs = create({
    extname: ".hbs",
    //configurar handlebars para que pueda trabajar con html convinados
    partialsDir: ["views/components"],
});
//definir motor plantilla
app.engine(".hbs", hbs.engine);
//definir extension del archivo
app.set("view engine", ".hbs");
//donde va a estar el archivo
app.set("views", "./views");
//middleware para paginas estaticas // dinamicas
app.use(express.static(__dirname + "/public"));
//como usar router una vez exportado
app.use("/", require("./routes/home"));
app.use("/", require("./routes/auth"));
//echar a andar al servidor
app.listen(port, () => {
    console.log("** SERVIDOR LISTO **");
});