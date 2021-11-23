const express = require('express');
const router = express.Router();
const authModel= require('../models/auth_model')


router.post('/authentication',function(req,res,next){

    const {email,password} =req.body
    authModel.authenticate(email,password).
    then(user => {
        //Validar que tenga por lo menos
        // un objeto el arreglo
        if(user.length>0){
        req.session.loggedIn=true
        req.session.name = email
        res.redirect('/productos')
    }else{
        req.flash('success',
         'No se encontro el usuario')
        res.redirect('/auth/login')
    }
    }).catch(err => {
        req.flash('error',
         'Ingrese correctamente los datos!')
        res.redirect('/auth/login')
    })


});
router.get('/', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('auth/login', {
        title: 'Login',
        email: '',
        password: ''     
    })
})
 
//display login page
router.get('/login', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('auth/login', {
        title: 'Login',
        email: '',
        password: ''    
    })
})
 

module.exports=router