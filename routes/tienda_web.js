const express=require('express')
const app = express.Router()
const productoModel = require("../models/productos_model")
const clienteModel = require("../models/clientes_model")
const ventaModel = require("../models/ventas_model")
const productoVendidoModel = require("../models/prod_ventas_model")
const formidable = require("formidable")
const path = require("path")
fs = require("fs")
//npm install uuid
const {v4: uuidv4} = require("uuid")

const indiceDeProducto = (carrito, idProducto) => {
    return carrito.findIndex(productoDentroDelCarrito => productoDentroDelCarrito.id === idProducto);
  }

const existeProducto = (carrito, producto) => {
    return indiceDeProducto(carrito, producto.id) !== -1;
  }

app.delete("/producto", async (req, res) => {

    if (!req.query.id) {
      res.end("Not found");
      return;
    }
    const idProducto = req.query.id;
    await productoModel.eliminar(idProducto);
    res.json(true);
  });

app.get("/detalle_venta", async (req, res) => {
    if (!req.query.id) {
      res.end("Not found");
      return;
    }
    const idVenta = req.query.id;
    const venta = await ventaModel.obtenerPorId(idVenta);
    venta.productos = await ventaModel.obtenerProductosVendidos(idVenta);
    res.json(venta);
  })
  app.get("/ventas", async (req, res) => {
    const ventas = await ventaModel.obtener();
    res.json(ventas);
  });
  app.post("/compra", async (req, res) => {
    const {nombre, direccion} = req.body;
    let total = 0;
  
    const carrito = req.session.carrito || [];
    carrito.forEach(p => total += p.precio);
    const idCliente = await clienteModel.insertar(nombre, direccion);
    const idVenta = await ventaModel.insertar(idCliente, total);
    // usamos for en lugar de foreach por el await
    for (let m = 0; m < carrito.length; m++) {
      const productoActual = carrito[m];
      await productoVendidoModel.insertar(idVenta, productoActual.id);
    }
    // Limpiar carrito...
    req.session.carrito = [];
    // ¡listo!
    res.json(true);
  });
  app.get("/carrito", (req, res) => {
    res.json(req.session.carrito || []);
  })
  // No está en un DELETE porque no permite datos en el body 
  app.post("/carrito/eliminar", async (req, res) => {
    const idProducto = req.body.id;
    const indice = indiceDeProducto(req.session.carrito, idProducto);
    if (indice >= 0 && req.session.carrito) {
      req.session.carrito.splice(indice, 1);
    }
    res.json(true);
  });
  app.post("/carrito/existe", async (req, res) => {
    const idProducto = req.body.id;
    const producto = await productoModel.obtenerPorId(idProducto);
    const existe = existeProducto(req.session.carrito || [], producto);
    res.json(existe);
  });
  
  app.post("/carrito/agregar", async (req, res) => {
    const idProducto = req.body.id;
    const producto = await productoModel.obtenerPorId(idProducto);
    if (!req.session.carrito) {
      req.session.carrito = [];
    }
    // por el momento no se pueden llevar más de dos productos iguales
    if (existeProducto(req.session.carrito, producto)) {
      res.json(true);
      return;
    }
    req.session.carrito.push(producto);
    res.json(req.body);
  });
  
  
  app.post('/fotos_producto', (req, res) => {
    const form = formidable({
      multiples: true,
      uploadDir: DIRECTORIO_FOTOS,
    });
  
    form.parse(req, async (err, fields, files) => {
      const idProducto = fields.idProducto;
      for (let clave in files) {
        const file = files[clave];
        const nombreArchivo = file.name;
        await productoModel.agregarFoto(idProducto, nombreArchivo)
      }
    });
  
    form.on("fileBegin", (name, file) => {
      const extension = path.extname(file.name);
      const nuevoNombre = uuidv4().concat(extension);
      file.path = path.join(DIRECTORIO_FOTOS, nuevoNombre);
      file.name = nuevoNombre;
    })
  
    form.on("end", () => {
      res.json({
        respuesta: true,
      })
    })
  
  });
  
  app.post('/producto', async (req, res) => {
    const producto = req.body;
    const respuesta = await productoModel.insertar(producto.nombre, producto.descripcion, producto.precio);
    res.json(respuesta);
  });
  
  app.get('/productos', async (req, res) => {
    const productos = await productoModel.obtener();
    res.json(productos);
  });
  app.get('/productos_con_fotos', async (req, res) => {
    const productos = await productoModel.obtenerConFotos();
    res.json(productos);
  });
  
  app.get('/producto', async (req, res) => {
    if (!req.query.id) {
      res.end("not found");
      return;
    }
    const producto = await productoModel.obtenerPorId(req.query.id);
    producto.fotos = await productoModel.obtenerFotos(req.query.id);
    res.json(producto);
  });

  module.exports=app