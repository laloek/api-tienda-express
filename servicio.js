const express= require('express')
const path= require('path')
const fs = require('fs')
const flash = require("express-flash")
const formidable= require('formidable')
const session= require('express-session')
const  routerIndex =require('./routes/index')
const  routerProductos =require('./routes/productos')
const  tiendaWeb =require('./routes/tienda_web')
const routerAuth = require('./routes/auth')
const cookieParser=require('cookie-parser')
const port = 3000

var app = express();

// Configuracion de engine de vistas en carpeta view de EJS
//npm install ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash())

const DOMINIO_PERMITIDO_CORS = "http://localhost:4200",
  DIRECTORIO_FOTOS = path.join(__dirname, "fotos_productos"),
  DIRECTORIO_DIST = path.join(__dirname, "dist"),
  PUERTO = 3000;

  app.use("/foto_producto", express.static(DIRECTORIO_FOTOS));
  // Estático
app.use("/", express.static(DIRECTORIO_DIST));
app.use(
  session({
    secret: '123456abc',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
  }))
  
  if (!fs.existsSync(DIRECTORIO_FOTOS)) {
    fs.mkdirSync(DIRECTORIO_FOTOS);
  }
  app.use((req, res, next) => {
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", DOMINIO_PERMITIDO_CORS);
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Allow-Methods", "DELETE");
    next();
  });
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false }));
//npm install cookie-parser
app.use(cookieParser());
//Contenido estatico
app.use(express.static(path.join(__dirname, 'public')));
app.use('/crud',routerIndex)
app.use('/tw', tiendaWeb)
app.use('/auth', routerAuth)
app.use('/productos', routerProductos)

app.listen(port,function(){

    console.log('Example app ruta:localhost:'+port)
})