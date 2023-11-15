let express = require('express');
let bodyParser = require('body-parser');
let routes = require("./routes");
let path = require('path');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static('./public/js'));
app.use(routes);

let http = require('http');
let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
let port = process.env.PORT || 3000;

server.listen(port);
