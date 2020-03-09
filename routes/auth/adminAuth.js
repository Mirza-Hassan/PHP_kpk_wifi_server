exports = module.exports = function (app, mongoose) {

    var express = require('express');
    var router = express.Router();
    var { SHA256 } = require('crypto-js');
    var jwt = require('jsonwebtoken')
  
    router.get('/', function (req, res, next) {
        res.status(200).send("OK");
    });

    // router.post('/createAdmin/locked', function (req, res, next) {
    //     let body = req.body.formData;
    //     // console.log(body);
    //     body.password = SHA256(JSON.stringify(body.password) + app.get('jwtsalt')).toString();
    //     console.log(body.password);
    //     //creaed password hash
    //     const admin = new  app.db.models.Admin(body);
    //     admin.college=mongoose.Types.ObjectId('5c120d5e23539936b74c8211')
    //     admin.save().then(userData => {
    //         console.log(userData); });
    //     res.status(200).send("OK");
    // });

    router.get('/test',(req,res)=>{
        payload= req.body.formData;
        console.log("payload=",payload);
        let query = app.db.models.Admin.findOne({ "userName": payload.userName, "password" : SHA256(JSON.stringify(payload.password) + app.get('jwtsalt')).toString()  })
        query.populate('college').exec(function (err, data) {//.populate('college').
            // app.log(data);
        })
        })

    router.post('/login', function (req, res, next) {
        // console.log(req.body);
        let payload=req.body.formData;
        console.log('payload=',JSON.stringify(payload));
        // body.password = SHA256(JSON.stringify(body.password) + app.get('jwtsalt')).toString();
        console.log('password=',SHA256(JSON.stringify(payload.password) + app.get('jwtsalt')).toString());
        
        let query=app.db.models.Admin.findOne({ "userName": payload.userName, "password" : SHA256(JSON.stringify(payload.password) + app.get('jwtsalt')).toString()  })
        query.populate('college').exec(function (err, data) {
            // app.log(data);
            if (!data) {
                return res.send({ success: false, message: "Please Provide A Valid UserName or Password" })
            }
            databaseToken = jwt.sign({ userName: data.userName, _id: data._id }, app.get('jwtsalt').toString()); //app.get('jwtsalt')
            let tokenTableData = { databaseToken, userName: data.userName, adminId: data._id }
            // console.log(tokenData);
            const Session = new app.db.models.loggedinAdmin(tokenTableData);
            Session.save().then(sessionDoc => {
                app.log(sessionDoc)
                // sessionDoc.role="Admin";
                return res.send({ success: true, message:"Login Successful", 
                userData: {...sessionDoc._doc, "role":data.role,"college": data.college?data.college.name:null  } 
              }); //, routes: routes
                // })
               }).catch(err => {
                console.log(err);
                  res.send({ success: false, message: err.message });
                })
            })
            });

            router.put('/changePassword', function (req, res, next) {
                // let {password,current_password}=req.body;

                let payload= req.body.formData;
                console.log(SHA256(JSON.stringify(payload.password) + app.get('jwtsalt')).toString());
                
                console.log(JSON.stringify(req.body));
                let query={"_id":payload.adminId,"password":SHA256(JSON.stringify(payload.current_password) + app.get('jwtsalt')).toString() };
                console.log(JSON.stringify(payload));
                
                app.db.models.Admin.findOne(query).exec((err,doc)=>{
                    console.log('doc=',doc);
                    
                    if(!doc){
                        res.send({ success: false, message:"Error: Your password is incorrect!"});
                    }
                    else{
                        console.log('admin user=',doc);
                        app.db.models.Admin.findOneAndUpdate(query,{$set:{ "password":SHA256(JSON.stringify(payload.password) + app.get('jwtsalt')).toString() }},{new:true}, function (err, doc) {
                            if(!doc){
                                //update failed
                                res.send({ success: false, message:"Error: Something went wrong"});
                            }
                            else{
                                res.send({ success: true, message:"Success: Password updated"});
                            }
                        })
                           
                            
                    }

                })
                
            });
                // const role = app.db.models.Role;
                // role.find({ roles: "SuperAdmin" }).then(roleData => {
                //     console.log(roleData);
                //     if (!roleData) {
                //         return res.send({ success: true, userData, routes: [] });
                //     }
                //     let routes = [];
                //     roleData.map(data => {
                //         routes.push(data.path);
                //     })
                //     app.log(routes);
    app.use('/adminauth', router);
}

