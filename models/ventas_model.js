const conexion = require("../config/conexion");
module.exports = {

obtener(){
    return new Promise((resolve,reject) => {
        
        conexion.query('select ventas.id,ventas.total,clientes.nombre,clientes.direccion from ventas '+
        ' inner join on ventas.id_cliente= clientes.id_clientes', (err,resultados)=>{

            if(err)reject(err)
            else resolve(resultados)
        })

    })
    },
obtenerPorId(Id){
    return new Promise((resolve,reject) => {
        
        conexion.query('select ventas.id,ventas.total,clientes.nombre,clientes.direccion from ventas '+
        ' inner join on ventas.id_cliente= clientes.id_clientes  where ventas.id_ventas=?',
         [Id],
         (err,resultados)=>{

            if(err)reject(err)
            else resolve(resultados)
        })
    });
},
insertar(idCliente,total){   
    
    return new Promise((resolve,reject) => {
        
    conexion.query('insert into ventas (id_cliente,total) values (?,?)',
     [idCliente,total],
     (err,resultado)=>{

        if(err)reject(err)
        else resolve(resultado.insertId)
    })
});


},
obtenerProductosVendidos(idVenta){

    return new Promise((resolve,reject) => {
        
        conexion.query('select productos.* from productos_ventas inner join productos.id_productos=productos_ventas.id_productos_ventas '
        +' where pruductos_ventas.id_venta=?',
         [idVenta],
         (err,resultados)=>{

            if(err)reject(err)
            else resolve(resultados)
        })
    });
},

}
