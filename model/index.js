module.exports = function(app,mongoose){
    require('./accessRequest')(app,mongoose);
    require('./complain')(app,mongoose);
    require('./networkUser')(app,mongoose);
    require('./college/college')(app,mongoose);
    require('./counter')(app,mongoose);

    //user rbac
    require('./adminUser')(app,mongoose);
    require('./userRole')(app,mongoose);
    require('./session')(app,mongoose);
}