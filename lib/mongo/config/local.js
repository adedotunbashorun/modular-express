module.exports = local = {
    app: {
        port: process.env.PORT
    },
    db: {
        url: process.env.DEV_URL,
        host: process.env.DEV_DB_HOST,
        port: parseInt(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_DATABASE || 'mymappapi'
    }
}