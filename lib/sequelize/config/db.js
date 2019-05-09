const Sequelize = require('sequelize')
const database = require('./config')

let sequelize

if (process.env.DATABASE_URL) {

    /** @type {Sequelize} [database connection for heroku production] */
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        port: 5432,
        host: "<heroku host>",
        logging: true //false
    })

} else {

    /** @type {Sequelize} [database connection for development env] */
    sequelize = new Sequelize(
        database.development.database,
        database.development.username,
        database.development.password, {
            host: database.development.host,
            dialect: database.development.dialect,
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    )
}

module.exports = sequelize