module.exports = function(app,mongoose){

//middleware
require('./auth/authMIddleware')(app, mongoose);
app.use("/api/v1/admin",app.authMiddleware);
require('./auth/logMiddleware')(app, mongoose);
app.use("/",app.logRequestStart);


require('./accessRequest')(app,mongoose);
require('./networkUser')(app,mongoose)
require('./College')(app,mongoose)
require('./event_routes')(app,mongoose)
require('./complain')(app,mongoose);
require('./home')(app,mongoose);



require('./auth/adminAuth')(app,mongoose);

//test routes
require('./adminUsers')(app,mongoose);
}