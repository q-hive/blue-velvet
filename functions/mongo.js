//Import Mongoose
import {config} from 'dotenv'
config()
import mongoose from "mongoose";
//Set URI
const URI = process.env.MONGODB_URI;
//Config Object to Avoid Deprecation Warnings
const configMongo = {useNewUrlParser:true, useUnifiedTopology:true};

mongoose.connect(URI, configMongo);

//Store Connection Object
const db = mongoose.connection;

//CONNECTION EVENTS
db.on("open", () => {
    console.log(`You are connected to Mongo`);
})
.on("error", (err) => {
    console.log("No se ha podido conectar a la instancia de mongo")
    console.log(err);
})
.on("close", () => {
    console.log(`You are no longer connected to Mongo`);
});

export {mongoose}