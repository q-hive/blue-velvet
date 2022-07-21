// * Import Mongoose
import { config } from 'dotenv'
import mongoose from "mongoose";

config()
// * Set URI
const URI = process.env.MONGODB_URI;
// * Config Object to Avoid Deprecation Warnings
const configMongo = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(URI, configMongo, ()=> {
    console.log('Connected to MongoDB');
});

//Store Connection Object
const db = mongoose.connection;

//CONNECTION EVENTS
db.on("open", () => {
    console.log(`You are connected to Mongo`);
})
.on("error", (err) => {
    console.log("It is no possible to connect to mongo due to an error")
    switch(err.name){
        case "MongooseServerSelectionError":
            console.log("The error is caused by the IP adress")
        default:
            break;
    }
    console.log(err);
    mongoose.connection.close()
})
.on("close", () => {
    console.log(`You are no longer connected to Mongo`);
});

export { mongoose }
