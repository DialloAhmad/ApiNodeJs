const express = require('express');
const User = require('../model/users');
const bcrypt = require("bcryptjs");
const passport = require('passport');
const router = express.Router();


//Enristrement d'un utilisateur
router.post('/register', (req, res) => {

  // Récupération des champs du corps de la requête
  const {name,email,password,pseudo,lastName,isAdmin} = req.body;  
    
  let errors = [];
  //On vérifie si tous les champs ont été rempli
  if(!email || !pseudo || !name || !lastName || !password || !isAdmin){
       errors.push({msg: "Veuillez remplir tous les champs"});
   }
   
   if(errors.length > 0) {
     res.status(errors.status || 500);
     res.json({
          message: errors.msg,
          error: errors
     })
   }else{
    // Vérification del'email et du pseudo
    User.findOne({$or : [{email: email}, {pseudo: pseudo}]})  
    .then(user=>{
      if(user){
        errors.push({msg: "KO"})
        res.json({
          message: errors.msg,
          error: errors
        })
      }else{
        const newUser = new User({
        email, pseudo, name, lastName, password, isAdmin
        })              
        //Hachage du mot de passe
        //Permet de hacher le mot de passe pour une meilleure sécurité 
        bcrypt.genSalt(10, (err,salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            //Définition du mot de passe haché
            newUser.password = hash;
            
            // Enregistrement d'un nouveau user dans la base de donnée
            newUser.save() 
            .then(user=>{
                res.send("OK");
            })
            .catch(err => console.log(err));
          })
        )
      }
    })
  }
});

module.exports = router;