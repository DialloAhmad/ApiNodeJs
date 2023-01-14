const { Router } = require('express');
const express = require('express');
const User = require('../model/users');

const router = express.Router();

const user = require("../model/users");

//Récupération du profil d'un utilisateur
router.post('/profil', (req, res) => {
    const {email} = req.body;
    user.findOne({email: email})
    .then(user=>{
        let userProfil = [];
        userProfil.push({
            "lastName": user.lastName,
            "Name": user.name,
            "Email": user.email,
            "Pseudo": user.pseudo
        });

        res.json(userProfil);
    }).catch(err => console.log(err)) 
});

//Enregistrement des fichiers
router.post('/add-file', async(req, res)=>{
    const {email} = req.body;
    try{
        if(!req.files){
            res.send({
                status:false,
                message : 'No File uploaded'
            });
        }else{
            //pour utiliser le nom attribuer au moment de l'envoi du fichier
            let avatar = req.files.file;
            //Enregistré le fichier dans le dossier upload
        
            avatar.mv("./upload/"+avatar.name);
        
            //Envoi de la reponse 
            res.send({
                status:true,
                message:'Fichier Enregistré' ,
                data:{
                    name:avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            })
        }
        
    } catch(err){console.log(err)}
    
});

//Suppression d'un utilisateur 
router.delete('/users/rm', async(req, res) => {
    const {emailAdmin, pseudoUser} = req.body;

    if(await admin(emailAdmin)){
    // Vérification de l'existance de l'utilisateur avant de le supprimé
      const userfound =  await  User.findOne({pseudo:pseudoUser});
        if(userfound){
            await user.deleteOne({pseudo:pseudoUser});
              res.send("L'utilisateur a été supprimer avec succée");
        }else{
            res.send("Aucun utilisateur n'existe avec ce pseudo");
        }  
    }
    else  res.send("Seul un administrateur a le droit de supprimer un utilisateur");
   
})
//Liste des utilisateurs
router.post('/users/list', async(req, res) => {
    const {email} = req.body;
    
    if(await admin(email)){
        // Récupération des champs name lastName email pseudo
        let data = await user.find({}).select('name lastName email pseudo'); 
        res.send(data);
    }else{
        res.send("Seul un administrateur a le droit de voir la liste des utilisateurs"); 
    }
    
})

//Vérification du type d'utilisateur admin ou non
const admin = async (email) =>{
   try{
    let userfound  = await user.findOne({email:email}).exec(); 
    return userfound.isAdmin;
   }catch(error){
    console.log(error);
   }
}

module.exports = router;