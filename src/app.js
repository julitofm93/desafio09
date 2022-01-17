//DEPENDENCIAS
import express from 'express';
import cors from 'cors'
import productosRouter from './routes/productos.js'
import upload from './services/upload.js'
import {products} from './daos/index.js';
import __dirname from './utils.js';
import { engine } from 'express-handlebars'
import {Server} from 'socket.io'
import { generate } from './utils.js'

const app = express();


//CONFIGURO EL SERVIDOR
const server = app.listen(8080,()=>{
    console.log("server listening on port 8080")
})
//DECLARO EL SERVIDOR DEL SOCKET
export const io = new Server(server)


const admin = true;

app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url)
    req.auth = admin
    next()
})

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

//ROUTERS
app.use(express.static(__dirname+'/public'))
app.use('/api/productos',productosRouter);

//HANDLEBARS
app.engine('handlebars', engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.post('/api/uploadfile',upload.single('file'),(req,res)=>{
    const file = req.file;
    if(!file||file.length===0){
        res.status(500).send({message:"No se subio ningun archivo"})
    }
    res.send(file);
})


app.get('/views/productos', (req,res)=>{
    products.getAll()
    .then(result => {
        let preparedObj ={
            productos : result
        }
        console.log(preparedObj.productos)
        res.render('productos', preparedObj)
    })
})

app.get('/api/products-test', (req,res) => {
    let fakerProducts = generate()
    res.send({state:"succes", payload:fakerProducts})
})

app.get('/views/products-test', (req,res) => {
    let preparedObj = {
        products : generate()
    }
    res.render('productosFaker', preparedObj)
})

//SOCKET
let messages = []
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let productosSocket = await products.getAll();
    socket.emit('updateProductos', productosSocket)
    socket.emit('messagelog', messages)
    //Recibe la informacion del input
    socket.on('message', data=>{
        //Le indicamos que con la informacion del input devuela el mensaje con la info
        //con el 'io.emit' hacemos que ese mensaje se envie a todos los clientes
        messages.push(data)
        io.emit('messageLog',messages)
    })
})

