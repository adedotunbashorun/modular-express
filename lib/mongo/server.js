let express = require('express')
let morgan = require('morgan')
let path = require('path')
let mongoose = require('mongoose')
let cors = require('cors')
let bodyParser = require('body-parser')

const config = require('./config')
app = express()

const port = config.app.port

try {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(config.db.url, { useNewUrlParser: true }).then(() => { // if all is ok we will be here
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
    origin: [],
    credentials: true
}))

//middleware for logging your request
app.use(morgan('dev'))

//parses the JSON, buffer, formdata, string and URL encoded data submitted using HTTP POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//this only accept formdata
// app.use(express.json({ limit: '50mb' }))
// app.use(express.urlencoded({ limit: '50mb', extended: false }))

//set static folder
app.use(express.static(path.join(__dirname, '/')))
app.use('/', express.static(path.join(__dirname, '/')))


app.set('port',port)

module.exports = app