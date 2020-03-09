const sendEmailLocal = require('./helpers/helpers');
module.exports= function(app,mongoose){

// import {sendEmailLocal} from './helpers/helpers';

var express= require('express');
var router = express.Router();
var bodyParser= require('body-parser');
router.use(bodyParser.json());

//creating complaint
router.post('/complainForm', function (req, res) {
console.log('formData=',JSON.stringify(req.body));
var complaint = new app.db.models.Complain(
    req.body.formData
);
//send error if request ref no is invalid
// let query=app.db.models.AccessRequest.findOne({"ref_no":req.body.formData.request_ref_no});
let query = app.db.models.NetworkUser.findOne({ "username": req.body.formData.username });
query.exec(function (err, networkuser_doc) {
    if (err)
        res.status(200).send({ success: false, message: `Error: A User with username:${req.body.formData.username} doesnot exists` });
    else if (!networkuser_doc) {
        res.status(200).send({ success: false, message: `Error: A User with username:${req.body.formData.username} doesnot exists` });
    }
    else {
        console.log(networkuser_doc);
        console.log('finding request with query=',JSON.stringify(networkuser_doc.request_ref_no) ,JSON.stringify(req.body.formData.nic) );
        
        // a username exists, so populate the complain object
        complaint.username = req.body.formData.username;
        let query2 = app.db.models.AccessRequest.findOne({ "_id": networkuser_doc.request_ref_no , "nic": req.body.formData.nic}); //query AR by ref_no in NUser table(not null)
        query2.exec(function (err, request_doc) {
            if (err)
                res.status(200).send({ success: false, message: `Error: Access request not found for CNIC:${req.body.formData.nic}` });
            else if (!request_doc) {
                res.status(200).send({ success: false, message: `Error: Access request not found for CNIC:${req.body.formData.nic}` });
            }
            else {
                //a request object found, so set it and save
                complaint.request_ref_no=request_doc._id;
                complaint.save().then(x => {
                    console.log("saved= ", x);
                    res.status(200).send({ success: true, message: `Complain registered successfully with ID: ${x.ref_no}`, userData: x });
                }).catch(err => {
                    console.log(err)
                    res.status(400).send(err);
                });
            }
            
        });//exec query2
        // res.status(200).send({ success: true, message: "Deleted successfully" });
    }
});//exec

});
//update complain
router.put('/complain',  function (req,res) {
    console.log('update complain called',req.body.formData);
    
    var query = { _id: req.body.formData._id };
        let myquery=app.db.model('Complain').findOneAndUpdate(query,{$set:{ "status":req.body.formData.status, "acknowledge_comment":req.body.formData.acknowledge_comment, "updated_by":req.body.formData.updated_by?req.body.formData.updated_by:"" }},{new:true});
        myquery.populate('request_ref_no').exec(function (err, complain) {
            if(!complain)
                res.status(200).send({success:false,message:`Complain with id ${req.body.formData._id } not found`});
            else{
            res.status(200).send({success:true,message:`Complain with id ${complain.ref_no} resolved successfully`, userData:complain});
    //send email if Complain resolved
     if(complain.status==="acknowledged"){
    // app.db.model('AccessRequest').findOne({"request_ref_no":doc.request_ref_no},{},(err,request_doc)=>{
    let accessRequest=complain.request_ref_no;
    if(accessRequest){
    console.log('AccessRequest found,now sending email=',accessRequest);
    const mailOptions = {
        from: '"KPK IT helpdesk" <ptcl@ptcl.net>',
        to: accessRequest.email  };
        mailOptions.subject = `Complaint resolved ${accessRequest._id}`;
        mailOptions.html = `Dear user<br/>
            Your complaint  <b>${complain.ref_no}</b> 
            Has been resolved.
            <br/>
            Thank you<br/>
            IT Department , Govt.KPK 
            </html>
            `;
        sendEmailLocal(mailOptions);
    }}
            }//if complain updated
        });
    });

router.get('/complain',function (req,res) {
    // console.log('complain found~~~~');
    var R= app.db.model('Complain');
    R.find({}).populate('request_ref_no').exec( function(err, complains) {
        if(!complains)
            res.status(200).send({success:false,message:`Something went wrong`});
        else
            res.status(200).send({success:true,message:`complain data fetched success`,userData:complains}); 
      })
    //   .catch((err)=>res.status(200).send({success:false,message:`Something went wrong ${err}`}));
});

router.get(`/complain/:id`,function (req,res) {
    // console.log("complain found",req.params.id);
    var x= app.db.model('Complain');
    x.findById(req.params.id).populate('request_ref_no').exec(function(err, complain) {
        res.status(200).send({complain}); 
      });
});

// router.post('/complainForm',function (req,res) {
//     console.log(req.body);
//     // var request=new app.db.models.AccessRequest({
//     //     fullName: req.body.fullName,
//     //     nic:req.body.nic,
//     //     rollno:req.body.rollno
//     // });
//     // var request=new app.db.models.AccessRequest(
//     //     req.body.formData
//     // );
//     // console.log(request);
    
//     // request.save().then(x => {
//     //     console.log(x);
//     //     res.status(200).send(x);
//     // }).catch(err => {
//     //     console.log(err)
//     //     res.status(400).send(err);
//     // });
// });
app.use('/api/v1',router);
}