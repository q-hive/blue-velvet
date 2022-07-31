import express from 'express'
import http from 'http'
import cors from 'cors'
import fileUpload from 'express-fileupload'


import { useMorgan } from './logs/morgan.js';
import { 
    adminRoutes, ordersRoutes, organizationRoutes, 
    productsRoutes, taskRoutes, passphraseRoutes 
} from './network/routes.js'
import { authRoutes } from './network/routes.js'


var port = normalizePort(9999 || process.env.PORT)

const app = express()

app.set('port', port)

const {pathname: buildPath} = new URL('../build', import.meta.url) 

app.use(express.static(buildPath))
app.use(express.json())
app.use(fileUpload())


/* Morgan implementation */
useMorgan(app);

/*
 *  CORS Implementation
 */
const originsList = ["http://localhost:3000"]
 
app.use(cors({
    origin: originsList[0],
    credentials: true
}));

const {pathname: indexPath} = new URL('../build/index.html', import.meta.url)

app.get(/^\/(?!api).*/, (req, res, ) => {
    res.sendFile(indexPath)
})

authRoutes(app)
organizationRoutes(app)
productsRoutes(app)
ordersRoutes(app)
adminRoutes(app)
taskRoutes(app)
passphraseRoutes(app)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError);
server.on('listening', onListening)



function normalizePort(num){
    const port = parseInt(num, 10)

    if(isNaN(port)){
        return val
    }

    if(port > 0){
        return port
    }

    return false
}

function onError(err){
    console.log('Error en el server')
    
    if(err.syscall !== 'listen'){
        throw err
    }

    const bind = typeof port === 'string'
        ? 'Pipe' + port
        : 'Port' + port;

        switch(err.code){
            case 'EACCESS':
                console.error(bind + ' requieres elevated privileges')
                process.exit(1)
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1)
            default:
                throw err;
        }
}

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    console.log('Listening on ' + bind)
}

