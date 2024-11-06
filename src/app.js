import express from 'express';
import {engine} from 'express-handlebars'
import {router as vistasRouter} from './routes/vistasRouter.js'
import {Server} from 'socket.io'


const PORT = 3000

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('./src/public'))
app.engine('handlebars', engine())
app.set('view engine','handlebars');
app.set('views','./src/views')

app.use('/',vistasRouter)



const server = app.listen(PORT,()=>{
    console.log(`puerto corriendo en puerto ${PORT}`);
    
});

const io = new Server(server)

const conectados = []
const mensajes = []

io.on('connection',socket=>{
    console.log(`cliente conectado con id ${socket.id}`);
    
    socket.emit('saludo', 'bienvenido al server. Identidicate', mensajes)

    socket.on('id', nombre => {
        conectados.push({
            id: socket.id,
            nombre: nombre
        })
        socket.broadcast.emit('nuevo-usuario', nombre)
    })
    socket.on('mensaje', (nombre , mensaje) => {
        mensajes.push({
            nombre,
            mensaje
        })
        io.emit('nuevoMensaje', nombre, mensaje)

    })
    socket.on('disconnect', () =>{
        let usuario = conectados.find(c => c.id === socket.id)
        if(usuario){
            io.emit('saleUsuario', usuario.nombre)
        }
    })
})
