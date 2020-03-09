const sendEmail=require('./helpers/helpers'); 

function sendEmailOnWifiRequestRejectedToMS(app,doc,adminName) {
    //console.log('Email sent');
    var collegeName=doc.college,wifi_request_id=doc._id;
     //let query= app.db.models.College.findOne({"name":doc.college});
     //goto college via name, then goto Admin via ID
     let AdminUser_Name="Anonymous";
     app.db.models.Admin.findOne({"_id":adminName}).exec((err,doc)=>{
        if(doc){//set the Fullname of Admin user
            AdminUser_Name=doc.name;
            console.log('Admin user~~~~~~~~~~',doc);
        }
let mailOptions = {
from: '"KPK IT" <ptcl@ptcl.net>',
subject : 'Wifi request rejected',
html : `
    <html>
    A wifi request:${wifi_request_id} from College: ${collegeName} is rejected by ${AdminUser_Name}
    </html>
    `
};
//query the email of MS Admin user, convention: get the first MS user's
app.db.models.Admin.findOne({"role":"SuperAdmin"}).exec((err,doc)=>{
    if(!doc)
        return;
    mailOptions.to=doc.email;
    sendEmail(mailOptions);
});

     });
}


module.exports= function(app,mongoose){


var express= require('express');
var router = express.Router();
var bodyParser= require('body-parser');
var helpers=require('./helpers/helpers');
router.use(bodyParser.json());

router.get('/requestFormUpdate',  function (req,res) {
    console.log('~~~~~~~~~~~~~~~~~~~~~');
    var cursor = app.db.models.AccessRequest.find({});
    while (cursor.hasNext()) {
        var doc = cursor.next();
        app.db.models.AccessRequest.update({ _id: doc._id }, { $set: { _id: new String(doc._id) } });
    }
    // app.db.models.AccessRequest.find({})
    // .exec((err, docs) => {
    //     if (err || docs == undefined || docs.length == 0)
    //         ;
    //     else {
    //         docs.forEach((x) => {
    //         x._id = new String(x._id); // convert field to string
    //         app.db.models.AccessRequest.save(x);
    //         })
    //         // docs.forEach((doc) => {
    //         //     app.db.models.AccessRequest.findOneAndUpdate({_id: doc._id}, 
    //         //                                   {$set: {_id: doc.ref_no}})
    //         //      .exec();
    //         //      console.log('updated successfully');
                 
    //         // });
    //    }
    // });  
});

//creating request
router.post('/requestForm',  function (req,res) {
    // console.log(req.body);
    var request=new app.db.models.AccessRequest(
        req.body.formData
    );
    request.save(function (err) {
        if (err) {
            console.log(err.code);
        if(err.code === 11000)
            res.status(200).send({ success: false, message: `Error: Your CNIC number already exists`});
        else
            res.status(200).send({ success: false, message: `Something went wrong!`,err});
        }
        else{
            res.status(200).send({ success: true, message: `Wifi request created successfully`});
        }
    });
    // request.save().then(x => {
    //     console.log("saved= ",x);
    //     res.status(200).send(x);
    // }).catch(err => {
    //     console.log(err)
    //     res.status(400).send(err);
    // });
});
    // var prefix;
    //  const prefix= await helpers.getCollegePrefix(app,req.body.formData.college);
    // await app.db.model('College').findOne({"name":req.body.formData.college},{},(err,doc)=>{
    //     //console.log('prefix=',doc);
    //      prefix=doc.id_prefix;
    // })
    // console.log('got=',prefix);
    
    // app.db.model('Counter').findOne({"_id":"AccessRequest"})
    // .then((data)=>{
    //     console.log(prefix+data.seq);
    //     request.ref_no=prefix+data.seq;
    // })
    // const count= helpers.updateAndGetCounter(app,'AccessRequest');


    // router.post('/counter',function (req,res) {
    //     console.log(req.body);
    //     const prefix=helpers.getCollegePrefix(app,req.body.formData.college);
    //     const count= helpers.updateAndGetCounter(app,'AccessRequest');
    //     var request=new app.db.models.AccessRequest(
    //         req.body.formData
    //     );

    // console.log(request);




//updates the status for now
router.put(`/request`,(req,res)=>{
    var query = { _id: req.body.formData._id };
    // console.log('update=',...req.body,"saqib");
    var R= app.db.model('AccessRequest');
    R.findOneAndUpdate(query,{$set:{ "status":req.body.formData.status ,"updated_by":req.body.formData.updated_by?req.body.formData.updated_by:"anonymous" }},{new:true}, function (err, request) {
        if(!request){
            res.status(200).send({ success: false, message: `Error: Not found`});
        }
        else{
            if(req.body.formData.status==="rejected"){
                //let message=`Disapproived a requests with id: ${request._id } by Admin: ${req.body.formData.updated_by?req.body.formData.updated_by:"anonymous" }`
                sendEmailOnWifiRequestRejectedToMS(app,request, req.body.formData.updated_by?req.body.formData.updated_by:null );
                app.log(`Disapproived a requests with id: ${req.body.formData._id } by Admin: ${req.body.formData.updated_by?req.body.formData.updated_by:"anonymous" }`)
                res.status(200).send({ success: true, message:`Disapproved Request: ${req.body.formData._id}`,userData: request});
            }
            else
                res.status(200).send({ success: true, message:`Approved Request: ${req.body.formData._id}`,userData: request});
               

        }

    });
    // R.findOneAndUpdate(query,{}, (error,data)=>{
    //     console.log("data=",data);
    // });
    // const query={"_id":req.query.id};
    // Q.findById("5c1211384665333aaaa0c2b7", function(err, college) {
    //     console.log(college);
    //     res.status(200).send({college}); ``
    //   });
     //res.status(200).send({"request":true});
});

router.post('/request',function (req,res) {
    // console.log('request found~~~~');
    let query={};
    if(req.body.college) //filter request by admin's college
        query["college"]=req.body.college;
    var R= app.db.model('AccessRequest');
    R.find(query, function(err, requests) {
        // console.log(requests);
        res.send({success:true,requests});  
      });
});

router.get(`/request/:id`,function (req,res) {
    // console.log("request found",req.params.id);
    
    var x= app.db.model('AccessRequest');
    x.findById(req.params.id, function(err, request) {
        if(!request){
            res.status(200).send({success:false,message:`Requests with id ${rq.params.id} Not found`})
        }
        else{
            //todo format the message at serrver and client end
        // console.log(request);
        res.status(200).send({ success: true, message: `ok`,userData:request});
        }
      });
});

app.use('/api/v1',router);
}