module.exports= function(app,mongoose){

var router = require('express').Router();
var bodyParser= require('body-parser');
router.use(bodyParser.json());


//creating networkuser
router.post('/networkuser',function (req,res) {
    console.log('networkuser =',req.body.formData);
    var user=new app.db.models.NetworkUser(req.body.formData);

        //send error if request ref no is invalid
        let query=app.db.models.AccessRequest.findOne({"ref_no":req.body.formData.request_ref_no});
        query.exec(function (err, request_doc) {
            if (err)
            res.status(200).send({ success: false, message: `The request with reference number:${req.body.formData.request_ref_no}`});
            if(!request_doc){
                res.status(200).send({ success: false, message: `The request with reference number:${req.body.formData.request_ref_no} doesnot exists`});
            }
            else {
                user.save().then(NetworkUser => {
                    console.log(NetworkUser);
                    res.status(200).send({ success: true, message: `Wifi User created successfully with userName: ${NetworkUser.username}`, userData: NetworkUser });
                }).catch(err => {
                    console.log(err);
                    console.log(err.errors+ err.name+ err.errmsg);
                    if(err.code===11000)
                        res.status(200).send({"success":false, "message":`Error : A user with name:${req.body.formData.username} already exists  `});
                    else
                        res.status(200).send({"success":false, "message":"Error creating wifi user"});
                });
            }
});
});

router.get('/getAllNetworkUser',function (req,res) {
    var user= app.db.model('NetworkUser');
    // console.log(req);
    user.find({}, function(err, networkusers) {
        res.send({networkusers});  
      });
});

//update
router.put(`/networkuser/update`,function (req,res) {
var query = { _id: req.body.formData._id };
console.log("update NetworkUser =~~~~ ",req.body);
    let myquery=app.db.model('NetworkUser').findOneAndUpdate(query,{$set:{ "username":req.body.formData.username, "password":req.body.formData.password }},{new:true});
    myquery.exec(function (err, networkuser) {
        if(!networkuser)
            res.status(200).send({success:false,message:`User not found: ${req.body.formData._id}`});
        
        else{
        console.log("queried data=",networkuser);
        res.status(200).send({success:true,message:"User updated successfully", userData:networkuser});
        }
    });
});

router.get(`/networkuser/:id`,function (req,res) {
    console.log("NetworkUser found",req.params.id);
    var x= app.db.model('NetworkUser');
    x.findById(req.params.id, function(err, networkuser) {
        console.log("query result==~~~~",networkuser);
        res.status(200).send({networkuser}); 
      });
});

router.post('/networkuser/delete',function (req,res) {
    const x= app.db.model('NetworkUser');
    console.log(req.body);
    x.deleteOne({ _id: req.body._id }, function (err) {
        if(err){
            res.status(200).send({"success":false,"message":err});
        }
        else
        res.status(200).send({"success":true, message:`Deleted ${req.body._id}`});
    })
    });

app.use('/api/v1',router);
}