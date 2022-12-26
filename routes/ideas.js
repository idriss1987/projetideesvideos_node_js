const mongoose = require('mongoose');
const express = require('express');
const { ensureAuthenticated } = require("../helpers/auth")

const router = express.Router();

//chargement du model
require('../models/Ideas');
const Idea = mongoose.model("ideas");

//ideas/add route du formulaire 
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render("ideas/add");
});

//recupération des donnees et les affiché 'views/ideas/index'
router.get('/',ensureAuthenticated, (req,res)=>{

        Idea.find({user: req.user.id})
            .sort({date:'desc'})
            .then(ideas=>{
                    res.render('ideas/index',{
                        ideas: ideas,
                    });
                });
    });

//acces a toutes les routes
router.get('/allideas',ensureAuthenticated, (req,res)=>{

    Idea.find({})
        .sort({date:'desc'})
        .then(ideas=>{
                res.render('ideas/allideas',{
                    ideas: ideas,
                    user: req.user
                });
            });
});



//traitement du formulaire
router.post('/', ensureAuthenticated,(req,res)=>{
    console.log(req.body);
//verification du formulaire 
   //res.send("valide");

   //validations des informations
   let errors = [];

   if(!req.body.title){
    errors.push({text: "Please add a title "})
    }
    if(!req.body.details){
        errors.push({text: "Please add a details "})
        }
    if(errors.length >0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }else{
           //res.send('passé');
           const newUser = {
                title : req.body.title,
                details: req.body.details,
                user: req.user.id
            }

            new Idea (newUser)
                .save()
                .then(idea =>{
                    req.flash('success_msg','Idée de video ajoutée')
                    res.redirect('/ideas')
                    })
        }    
})

//route du formulaire de modification
router.get("/edit/:id",ensureAuthenticated,(req,res)=>{
        Idea.findOne({
                _id: req.params.id
            })
            .then(idea =>{
                if(idea.user != req.user.id){
                    req.flash('error_msg','Non Autorisé');
                    res.redirect("/ideas");
                }else{
                    res.render('ideas/edit',{
                        idea: idea,
                    });
                }
                    
                });
    });

//route de put 
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id: req.params.id
        })
        .then(idea =>{
            //nouvelle valeurs 
            idea.title = req.body.title,
            idea.details = req.body.details;

            idea.save()
                .then(idea=>{
                    req.flash('success_msg','Idée de video modifiée')
                    res.redirect('/ideas');
                })

        })
    })

//suppresion de données
router.delete('/:id', ensureAuthenticated, (req,res)=>{
        Idea.remove({ _id: req.params.id})
            .then(()=>{
                req.flash('success_msg','Idée de video supprimée')
                res.redirect('/ideas');
            })
    });
    
    module.exports = router;