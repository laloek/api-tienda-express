const conexion = require("../config/conexion");
const fs = require('fs');
const path = require('path');
const { resolve } = require("path");
//CRUD - Create,READ, UPDATE, DELETE
module.exports = {


insertar(nombre,descripcion,precio){

    return new Promise((resolve,reject) => {

        conexion.query('insert into productos (nombre,descripcion,precio)'+
       ' values (?,?,?)',[nombre,descripcion,precio],(err,resultado) => {
           if (err)reject(err);
           else resolve(resultado)
       })
    })

},
obtener(){

    return new Promise((resolve,reject)=>{


        conexion.query('select id_productos,nombre,precio from productos',(err,resultados)=>{

            if(err)reject(err);
            else resolve(resultados);
        })

    })


},
actualizar(id,nombre,precio){

    return new Promise((resolve,reject)=>{
        conexion.query('update productos set nombre =?,'+
        'precio=? where id_productos=?',[nombre,precio,id], (err)=>{
            if(err)reject(err);
            else resolve();
        })
    })
},
eliminar(id){
    //TODO - Agregar borrado de fotos

    return new Promise(async (resolve,reject)=>{
        const fotos=await this.obtenerFotos(id)
        for(let i=0;i<fotos.length;i++){
            await fs.unlinkSync(path.join(__dirname,"fotos_productos",fotos[i].foto))
        }

        conexion.query('delete from productos where id_productos =?',[id],
        (err)=>{
            if(err)reject(err);
            else resolve();
        })
    })
},
agregarFoto(idProducto,nombreFoto){

    return new Promise((resolve,reject)=>{

        conexion.query('insert into fotos_productos (id_producto,foto) '+
        'values  (?,?)',[idProducto,nombreFoto],(err,resultados)=>{
            if(err)reject(err);
            else resolve(resultados.insertId);
        })
    })
},
obtenerFotos(idProducto){
    return new Promise((resolve, reject) => {
        conexion.query('select id_producto, foto FROM fotos_productos '+
         'WHERE id_producto = ?',[idProducto],
         (err, resultados) => {
            if (err) reject(err);
            else resolve(resultados);
          })
    })
},

obtenerPorId(id){
    return new Promise((resolve, reject) => {

        conexion.query('select id_productos,nombre,descripcion,precio'+
        ' from productos where id_productos=?',[id],
        (err, resultados) => {
            if (err) reject(err);
            else resolve(resultados[0]);
          })
    })


},
obtenerPrimerFoto(idProducto){
    return new Promise((resolve, reject) => {
        conexion.query('select foto from fotos_productos'
        +' WHERE id_producto = ? limit 1',
        [idProducto],
        (err, resultados) => {
          if (err) reject(err);
          else resolve(resultados[0].foto);
        });
    })

},
obtenerConFotos(){

    return new Promise((resolve,reject) => {

        conexion.query('select *  form productos',
        async(err,resultados) =>{

            if(err)reject(err)
            else {
                for(let x=0;x<resultados.length;x++){
                    resultados[x].foto= await this.obtenerPrimerFoto(resultados[x].id)
                }

                resolve(resultados)
            }
        }
        )
    })
}


}