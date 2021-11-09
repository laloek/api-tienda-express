const conexion = require("../config/conexion");
module.exports = {

    insertar(idVenta,idProducto){

        return new Promise((resolve,reject)=>{

            conexion.query('insert into productos_ventas (id_venta,id_producto) values (?,?)', [idVenta,idProducto],
            (err,resultados)=>{
                if(err)reject(err)
                else resovle(resultados.insertId)
            })
        

    })
},
}