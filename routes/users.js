const mongoose = require('mongoose');
const express = require('express')
const bcrypt = require('bcryptjs');
const passport = require('passport')
const router = express.Router();


//chargement du model
require('../models/Users');
const User = mongoose.model("users");

//route user 
//login
router.get("/login",(req,res)=>{
    res.render('users/login')
})
//enregistrement
router.get("/register",(req,res)=>{
    res.render('users/register')
})


//login formulaire post 
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
        })(req,res,next);
});


//register fomulaire Post
router.post('/register',(req,res)=>{
        //pour tester 
 //console.log(req.body)
        //res.send('enregistrer')

    let errors = [];
    if(req.body.password !== req.body.password2){
        errors.push({text: 'le mot de passe doit etre le meme '})
        }
    
    if(req.body.password.length<4){
        errors.push({text:'le mot de passe doit contenir au moins 4 caractères'})
        }

    if(errors.length > 0){
        res.render('users/register',{
                errors: errors,
                name: req.body.nom,
                email: req.body.email,
                password: req.body.password,
                password2: req.body.password2
            })
        }else{
                //res.send('enregistrement passé')
                User.findOne({email: req.body.email})
                    .then(user =>{
                        if(user){
                            req.flash('error_msg','Email déja enregistré');
                            res.redirect('/users/register')
                        }else{
                            
                            const newUser = new User ({
                                name: req.body.nom,
                                email: req.body.email,
                                password: req.body.password
                            })
                            console.log(newUser)
            
                            bcrypt.genSalt(10, function(err, salt) {
                                bcrypt.hash(newUser.password, salt, function(err, hash) {
                                    if(err) throw err;
                                    newUser.password = hash;
                                    newUser.save()
                                        .then(user =>{
                                            req.flash('success_msg','Vous etes à présent enrégistré et vous pouvez vous connecter');
                                            res.redirect('/users/login');
                                            })
                                        .catch(err =>{
                                                console.log(err);
                                                return;
                                            })    
                                });
                            });
            
                            }
                    })
                
            }
})
// route du logout utilisateur 
router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) {
             return next(err);
             }
             req.flash("success_msg","vous etes a present deconnecté" )
        res.redirect('/users/login');
      });
    
})

module.exports = router;