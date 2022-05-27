//importar paquete express
const express = require("express");
//importar express-session
const session = require("express-session");
//importar mongo-connect
const MongoStore = require("connect-mongo");
//importar mongo sanitize
const mongoSanitize = require("express-mongo-sanitize");
//importar cors
const cors = require("cors");
//importar flash
const flash = require("connect-flash");
//importar Passport
const passport = require("passport");
//importar paquete express-handlebars
const { create } = require("express-handlebars");
//inmportar paquete csurf => rutas protegidas
const csurf = require("csurf");
//importar libreria request
const req = require("express/lib/request");
//importar modelo User de la BBDD
const User = require("./models/user");
//hacer uso variables de entorno
require("dotenv").config();
//importar BBDD
const clientDB = require("./database/db");
//instanciar aplicacion
const app = express();
//configuracion cors
const corsOptions = {
    credentials: true,
    origin: process.env.PATHHEROKU || "*",
    methods: ["GET", "POST"]
};
app.use(cors(corsOptions));

//middleware conf sesion
app.use(session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: "session-user",
    //guardar sesion en BBDD
    store: MongoStore.create({
        clientPromise: clientDB,
        dbName: process.env.dbName
    }),
    cookie: { secure: process.env.MODO === "production", maxAge: 30 * 24 * 60 * 60 * 1000 },
}));
app.use(flash());
//configuracion passport => manejo de sesiones
app.use(passport.initialize());
app.use(passport.session());
//serializeUser
passport.serializeUser((user, done) => done(null, { id: user._id, userName: user.userName }));
passport.deserializeUser(async (user, done) => {
    const userDB = await User.findById(user.id);
    return done(null, { id: userDB._id, userName: userDB.userName });
});
//definir puerto
const PORT = process.env.PORT;
//acceder a la configuracion de archivos handlebars => cambiar extension
const hbs = create({
    extname: ".hbs",
    //configurar handlebars para que pueda trabajar con html combinados
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
//middleware para habilitar formularios
app.use(express.urlencoded({ extended: true }));
//configuracion csurf => middleware
app.use(csurf());
//middleware sanitize
app.use(mongoSanitize());
app.use((req, res, next) => {
    //formularios
    res.locals.csrfToken = req.csrfToken();
    //mensajes de error
    res.locals.mensajes = req.flash("mensajes");
    next();
});
//como usar router una vez exportado
app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/perfil"));
//echar a andar al servidor
app.listen(PORT, () => {
    console.log("** SERVIDOR LISTO **");
});