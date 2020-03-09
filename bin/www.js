
var app= require('../app');
var debug = require('debug')('kpk-wifi-accessrequest:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '8000');
app.set('port',port);

var server= http.createServer(app);
server.listen(port);
server.on('error',onError);
server.on('listening',onListening);

///~~~~~~~~~~~~setup logging~~~~~~~~~~~~~~~~~~~~~~//
var fs = require('fs');
var util = require('util');
//these lines below make a debug.log file 
var dir = __dirname + '/../logs';
if (!fs.existsSync(dir))
  fs.mkdirSync(dir);

var log_file = fs.createWriteStream( dir + '/server.log', {flags : 'a'});
var log_stdout = process.stdout;
// console.log = function(d) { //
//   log_file.write(util.format(d) + '\n');
//   log_stdout.write(util.format(d) + '\n');
// };
console.info = function(d) { //
    log_file.write('[' + new Date().toUTCString() + '] '+util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
  };
  console.error = function(d) { //
    log_file.write('[' + new Date().toUTCString() + '] '+ util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
  };
  console.log = function(d) { //
    let log_line="";
    for (var i = 0; i < arguments.length; i++) {
        log_line+=" "+arguments[i];
      }
    log_file.write('[' + new Date().toUTCString() + '] '+util.format(log_line) + '\n');
    log_stdout.write(util.format(log_line) + '\n');
  };

// var access = fs.createWriteStream(__dirname  + '/node.access.log', { flags: 'a' })
//       , error = fs.createWriteStream(__dirname +'/node.error.log', { flags: 'a' });
// // redirect stdout / stderr
// process.stdout.pipe(access);
// process.stderr.pipe(error);






function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  }


  /**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }  