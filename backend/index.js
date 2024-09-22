const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require('body-parser');

const cors = require("cors");

const userRoutes = require("./routes/user");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));

const corsOptions = {

    origin: ["http://localhost:5500"],
    credentials: true,
    optionsSuccessStatus: 200,

};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
    console.log("Now connected to MongoDB Atlas.")
);

app.use("/users", userRoutes);


if (require.main == module){
    app.listen(4000 , () =>{
        console.log(`API is now online on port ${process.env.PORT} `);

    }) 


}

module.exports = { app, mongoose};