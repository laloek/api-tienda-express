const conexion = require("../config/conexion.js");
module.exports = {

insert(nombre,direccion){

    return new Promise((resovle, reject)=>{

        conexion.query('insert into clientes (nombre,direccion) values (?,?)',[nombre,direccion],
        (err,resultados)=>{
            if(err)reject(err)
            else resovle(resultados.insertId)
        })
    })

},


}