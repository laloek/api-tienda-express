const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.loggedIn){
  res.render('index', { title: 'Express' });
  }else{
    res.render('error',{message:'Acceso restringido',error:{status:301,stack:''}})
  }
});

module.exports = router;
