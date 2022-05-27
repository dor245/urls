//importar paquete de mongoose
const mongoose = require("mongoose");
//llamada a schema de mongoose
const { Schema } = mongoose;
// instacia del schema // definicion de propiedades
const urlSchema = new Schema({
    origin: {
        type: String,
        unique: true,
        required: true,
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true,
    },
    //relacionar URL con cada usuario
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});
//variable para modelo en mongo
const Url=mongoose.model("Url", urlSchema);
//exportar modelo para se utilizado en otros archivos
module.exports=Url;