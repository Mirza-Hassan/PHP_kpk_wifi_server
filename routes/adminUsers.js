exports = module.exports = function(app, mongoose) {

    var express = require('express');
    var router = express.Router();
    var { SHA256 } = require('crypto-js');
    // var jwt = require('jsonwebtoken')
    
    router.post('/create', function (req, res, next) {
        let body = req.body.formData;
        console.log('got cretae request',body);
        // console.log(req.body.formData);
        body.password = SHA256(JSON.stringify(body.password) + app.get('jwtsalt')).toString();
        // body.password = SHA256(body.password + app.get('jwtsalt')).toString().catch((error) => console.log(error));
        // console.log(body.password," ",body.college );
        const admin = new  app.db.models.Admin(body);
        admin.college=mongoose.Types.ObjectId(body.college);
        admin.save().then((userData) => {
                if(!userData)
                    res.status(200).send({success:false,message:`An error occurred ,${err}`});
                else
                    res.status(200).send({success:true,message:`Admin user ${userData.name} created successfully`});
        }).catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
            res.status(200).send({success:false,message:`Error: There was a duplicate key error`});
            console.log('Should not print more stuff');
        }
        else{
            // console.log(error.message);
            res.status(200).send({success:false,message:error.message});
            // res.status(200).send({success:false,message:`Something went wrong`});
        }
        });
    });

    router.post('/findAll',(req,res)=>{
        var users= app.db.model('Admin');
        users.find({}).populate('college').exec(function(err, data) {
            if (!data) {
                return res.send({ success: false, message: "Not Found" });
            }
            // console.log(data);
            res.send({success:true,userData:data});  
          });
        // res.send('my response')
    })

    router.post('/find',(req,res)=>{
        console.log('find one called~~~');
        
        if(!req.query.id)
            res.status(400).send({success:false , message:"please provide id in param"});
        
        app.db.models.Admin.findById({"_id":req.query.id}).populate('college').exec(function(err, data) {
        if (!data)
            return res.status(404).send({ success: false, message: "Not Found" });
        else
            res.status(200).send({success:true,userData:data})
        });
    })

    //update
router.put(`/update`,(req,res)=>{
    const formData=req.body.formData;
    var query = { _id: formData._id };
    // console.log("update = ",JSON.stringify(formData));
    formData.password= SHA256(JSON.stringify(formData.password) + app.get('jwtsalt')).toString();
    var R= app.db.model('Admin');
    R.findOneAndUpdate(query, formData,{new:true}, function (err, admin) {
        if(err)
            res.status(200).send({success:false,message:err});
        else if(!admin)
            res.status(200).send({success:false,message:"Not found"});
        else 
        res.status(200).send({success:true,message:"User updated success", userData:admin});
    });
})



    router.put('/delete',(req,res)=>{
        console.log('delete admin user', req.query.id);
        
        if(!req.query.id)
        res.status(400).send({success:false , message:"please provide id in param"});
        app.db.models.Admin.deleteOne({ _id: req.query.id }, function (err) {
            if(err)
                res.status(200).send({success:false,message:"Error"});
            else
            res.status(200).send({success:true,message:"Deleted successfully"});
        })
    });

    router.get('/', function (req, res, next) {
        res.status(200).send("OK");
    });
    app.use('/api/v1/admin/adminUsers', router);
  }