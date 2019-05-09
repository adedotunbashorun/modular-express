let express = require('express')
let morgan = require('morgan')
let bodyParser = require('body-parser');
let path = require('path')
let mongoose = require('mongoose')
let cors = require('cors')

const config = require('./config')
app = express()

const port = config.app.port

try {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(port, { useNewUrlParser: true }).then(() => { // if all is ok we will be here
        console.log("connected")
    }).catch(err => { // we will not be here...
        console.error('App starting error: Network Issue')
        return { error: err.stack, message: "Error Connecting to mongo db" }
        process.exit()
    })
} catch (err) {
    console.log(err)
    process.exit()
}

app.use(cors({
    origin: ['http://localhost:8080'],
    credentials: true
}))

app.use(morgan('dev'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.json({ limit: '50mb' }))
// app.use(express.urlencoded({ limit: '50mb', extended: false }))

//set static folder
app.use(express.static(path.join(__dirname, '/')))
app.use('/', express.static(path.join(__dirname, '/')))



app.listen(port)
console.log('server started ' + port)