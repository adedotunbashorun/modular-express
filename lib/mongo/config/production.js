module.exports = production = {
    app: {
        port: process.env.PORT || 5000
    },
    db: {
        url: (process.env.MONGODB_URI) ? process.env.MONGODB_URI : '',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 27017,
        name: process.env.DB_DATABASE || 'mymappapi'        
    }
}