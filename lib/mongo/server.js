let express = require('express')
let morgan = require('morgan')
let path = require('path')
let mongoose = require('mongoose')
let cors = require('cors')

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

//this is for your request data
app.use(express.json({ limit: config.data.limit }))
app.use(express.urlencoded({ limit: config.data.limit, extended: config.data.extended }))

//set static folder
app.use(express.static(path.join(__dirname, '/')))
app.use('/', express.static(path.join(__dirname, '/')))

//routes init
const routes = config.routes
routes.forEach( route => {
    app.use('/api', route)
});

app.set('port',port)

module.exports = app