exports = module.exports = function (app, mongoose) {
    // const logRequestStart = (req , res, next) => {
    //     console.info('[' + new Date().toUTCString() + '] '+ `${req.method} ${req.originalUrl}`)
    //     next();
    // }
    // app.use(logRequestStart)

//     var fs = require('fs');
// var util = require('util');
// //these lines below make a debug.log file 
// var dir = __dirname + '/../../logs';
// if (!fs.existsSync(dir))
//   fs.mkdirSync(dir);

// var log_file = fs.createWriteStream( dir + '/server.log', {flags : 'a'});
// var log_stdout = process.stdout;
// // console.log = function(d) { //
// //   log_file.write(util.format(d) + '\n');
// //   log_stdout.write(util.format(d) + '\n');
// // };
// console.info = function(d) { //
//     log_file.write('[' + new Date().toUTCString() + '] '+util.format(d) + '\n');
//     log_stdout.write(util.format(d) + '\n');
//   };
//   console.error = function(d) { //
//     log_file.write('[' + new Date().toUTCString() + '] '+ util.format(d) + '\n');
//     log_stdout.write(util.format(d) + '\n');
//   };
//   console.log = function(d) { //
//     let log_line="";
//     for (var i = 0; i < arguments.length; i++) {
//         log_line+=" "+arguments[i];
//       }
//     log_file.write('[' + new Date().toUTCString() + '] '+util.format(log_line) + '\n');
//     log_stdout.write(util.format(d) + '\n');
//   };



    // app.logRequestStart = (req , res, next) => {
    //     console.info(`${req.method} ${req.originalUrl}`)
    //     next()
    // }
    // app.use(logRequestStart)

    const getLoggerForStatusCode = (statusCode) => {
        if (statusCode >= 500) {
            return console.error.bind(console)
        }
        if (statusCode >= 400) {
            return console.warn.bind(console)
        }
    
        return console.log.bind(console)
    }
    
     app.logRequestStart = (req, res, next) => {
        console.info(`${req.method} ${req.originalUrl}`) 
    
        const cleanup = () => {
            res.removeListener('finish', logFn)
            res.removeListener('close', abortFn)
            res.removeListener('error', errorFn)
        }
    
        const logFn = () => {
            cleanup()
            const logger = getLoggerForStatusCode(res.statusCode)
            logger(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
        }
    
        const abortFn = () => {
            cleanup()
            console.warn('Request aborted by the client')
        }
    
        const errorFn = err => {
            cleanup()
            console.error(`Request pipeline error: ${err}`)
        }
        res.on('finish', logFn) // successful pipeline (regardless of its response)
        res.on('close', abortFn) // aborted pipeline
        res.on('error', errorFn) // pipeline internal error
        next()
    }
    
}