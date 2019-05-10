let express = require('express')
let morgan = require('morgan')
let bodyParser = require('body-parser');
let path = require('path')
let cors = require('cors')
let Sequelize = require('sequelize')

app = express()

const port = process.env.port || 5000

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

sequelize.authenticate().then(() => {
    console.log('Connected')
}).catch(err => {
    console.log(err, 'something is wrong')
    process.exit()
})

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

//routes


app.listen(port)
console.log('server started ' + port)