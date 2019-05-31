var http = require('http');
var app = require('../server'); // Notice the additional () here

http.createServer(app).listen(app.get('port'), function() {
    console.log('server started at http://localhost:'+app.get('port'));
});