var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var log = require('./libs/logger')(module);
var conf = require('./conf');
var morgan = require('morgan');
var app = express();

conf.rootDir = __dirname;
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// app.use(require('./middleware/sendHttpError'));
// app.use(require('./middleware/sendMessage'));

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'app')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app, express);

// app.use(require('./middleware/page404'));

require('./middleware/errorHandler')(app);

http.createServer(app).listen(process.env.PORT || conf.port, function () {
   log.info('Server is listening on localhost:' + conf.port)
});
