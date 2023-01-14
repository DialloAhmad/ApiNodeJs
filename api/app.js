const express = require('express');
const mongoose = require("mongoose")
const cors = require("cors");
const app = express();
const Port = process.env.Port || 3500;
const morgan = require("morgan");
const _ = require("lodash");
const fileUpload = require('express-fileupload');
const passport = require('passport');

//configuration de Mongoose
const db = require("./config/keys").MonguURI; 
// Connexion à MongoDB
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log("MongoDB Connected...."))
.catch(err => console.log(err));

require('./middleware/auth');



//BodyPaser
app.use(express.urlencoded({extended: false})); 

//Module pour le téléchargement des fichier
app.use(fileUpload({
    createParentPath:true
}))
app.use(cors());
app.use(morgan("dev"));

//Route
app.use('/', require('./route/index'));
app.use('/', require('./route/login'));
app.use('/', require("./route/register"));

//l'ensemble des route qui existe dans service sont securisé avec un token
app.use('/',passport.authenticate('jwt', {session: false}), require('./route/Service'));


app.listen(Port,()=>{console.log(`le serveur ecoute le port ${Port}`)}); 