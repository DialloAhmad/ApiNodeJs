const jwt = require("jsonwebtoken");
const passport = require('passport');
const { ExtractJwt } = require("passport-jwt");
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const User = require("../model/users");
const bcrypt = require('bcryptjs');

// Configuration de passport local 
passport.use(
    'login',
    new localStrategy({
        usernameField :'email',
        passwordField:'password'
    },
    async (email, password, done) => {
        try{
            User.findOne({email: email})
            .then(user => {
                if(!user) {
                    return done(null, false, {message:'E-mail incorrect'});
                }
                //Vérification du mot de passe
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(isMatch){
                        return done(null, user, {message:"Connexion avec succès"});
                    }else{
                        return  done(null, false, {message:"Mot de passe incorrect"});
                    }
                })
            })
            .catch(err => console.log(err));
        }catch(error){
            return done(error);
        }
    }
    )
);

  //Vérification du token
  passport.use(
    new JWTstrategy({
        secretOrKey:'TOP_SECRET',
        jwtFromRequest:ExtractJwt.fromUrlQueryParameter('secret_token')
    },
    async (token,done) =>{
        try{
     return done(null,token);
        }catch(error){
            done(error);
        }
    }
    )
  );

