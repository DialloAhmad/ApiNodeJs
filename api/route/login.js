const express = require('express');
 require('dotenv').config;
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../model/users");
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Authentification (login) avec passport;
router.post(
    '/login',
    async(req, res, next) => {
        passport.authenticate(
            'login',
            async(err, user, info) =>{
                try{
                    if(err || !user){
                        const error = new Error('Bad credential/incorect user');
                        return next(error);
                    }
                    req.login(
                        user,
                        {session :false},
                        async(error)=>{
                            if(error) return next(error);

                            const body = {_id: user._id,email:user.email}; // les parametres pour creer un token
                            const token = jwt.sign({user: body}, 'TOP_SECRET');

                            return res.json({token});
                        }
                    );
                }catch(error){
                    return next(error);
                }
            }
        )(req,res,next);
    }
)
    
module.exports = router;