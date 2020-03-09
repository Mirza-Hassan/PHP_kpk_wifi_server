exports = module.exports = function (app, mongoose) {
    // const cookieParser = require('cookie-parser')
    // app.use(cookieParser);
    app.authMiddleware = function (req, res, next) {
        console.log(`auth middle ware =====>>>>> ${req.method} ${req.originalUrl}`)
        const LoggedinAdmin = app.db.models.loggedinAdmin;
        console.log(req.body);
        // res.cookie("user_session","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNWMxNzZhODFhNzM0N2YyOGQ2MWRmZjQ4IiwiaWF0IjoxNTQ1MDM5NjAxfQ.luseuWhSiW4atLCd-SgAmhQPGj_bYMPntqHbhWroX_w")
        LoggedinAdmin.findOne({ databaseToken: req.body.databaseToken }).then(adminToken => {
            if (!adminToken) {
                return res.status(200).send({ sucess: false, message: "Unauthorize access please login and try again " })
            } else {
                next();
            }
        }).catch(err => {
            return res.send({ sucess: false, message: err.message })
        })
    }
}