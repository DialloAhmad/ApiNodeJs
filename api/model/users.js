const mongoose = require('mongoose');

//création du modèle pour la base de données

const UserSchema = new mongoose.Schema({
     email:{
        type:String,
        require:true
     },
     pseudo:{
        type: String,
        require:true
     },
     name:{
        type:String,
        require:true
     },
     lastName:{
        type:String,
        require:true
     },
     password:{
        type:String,
        require:true
     },
     isAdmin:{
        type:Boolean,
        require:true
     }
});

 const User = mongoose.model('progwebserveur',UserSchema);

 module.exports = User;