const conexion = require("../config/conexion.js");
module.exports = {

        authenticate(email,password){

            
    return new Promise((resolve, reject)=>{

            conexion.query('Select * from users where email= ? and password=?',[email,password], (err,resultado)=>{
                if(err)reject(err)
                else resolve(resultado)
            })

        })
    }

}