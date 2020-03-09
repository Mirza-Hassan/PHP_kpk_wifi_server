'use strict';

module.exports = function(app,mongoose){

const nodemailer = require('nodemailer');
var validator = require('validator');

var AccessRequest = new mongoose.Schema({

_id:{
        type:String,
        require:false,
        minlength:3
},
name:{
    type:String,
    require: true,
    minlength: 3
},
father:{
    type:String,
    require:true,
    minlength: 3
},
nic:{
    type: String,
    require: true,
    unique: true,
    dropDups:true
},
rollno:{
    type:String,
    minlength:3
},
office:{
    type:String,
    minlength:3
},
college:{
    type:String,
    require: true,
    minlength:3
},
phone:{
    type:String,
    require: true,
    minlength:3
},
email:{
    type: String,
    // unique: true,
    required: true,
    trim: true,
    validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
    }
},
status:{
    type:String,
    require: true,
    minlength:3
},
dob:{
    type:String,
    require: true,
    minlength:3
},
ref_no:{
    type:String,
    require:false
},
verified:{
    type:Boolean,
    require:false
},
session:{
    type:String,
    require:true
},
department:{
    type:String,
    require:true,
    enum: ["engineering", "medicine","commerce","other"],
},
created:{
    type: Date,
    default: Date.now,
},
updated:{
    type:String,
    require:false
},
created_by:{
    type:String,
    require:false
},
updated_by:{
    type:String,
    require:false
},
});
AccessRequest.pre('save',  function(next) {
    var doc = this;
    var prefix;
    app.db.model('Counter').findByIdAndUpdate({_id: 'AccessRequest'},
    {$inc: { seq: 1} },{upsert:true} ,async function(error, counter){
if(error)
    return next(error);
 await app.db.model('College').findOne({"name":doc.college},{},(err,doc)=>{
    //console.log('prefix=',doc);
        prefix=doc.id_prefix;
})
// console.log('got=~~~~~~',prefix+counter.seq);
doc.ref_no=prefix+counter.seq;
//set document id
doc._id=prefix+counter.seq;
next();
    });
});

AccessRequest.post('save', function(doc) {
    const mailOptions = {
        from: '"KPK IT" <ptcl@ptcl.net>',
        to: doc.email,
        subject : 'Verify your email!',
        html : `Thank you for submitting a wifi request. You will receive your credentials shortly. 
           Please click the below link to verify your email.
           <html>
           <br/>
           <a href="http://localhost:8000/api/v1/verify/request?id=${doc._id}">Verify Email</a>
           </html>
          `
      };
      sendEmailLocal(mailOptions);
  });
// app.db.model('Counter').findOne({"_id":"AccessRequest"})
// .then((data)=>{
//     console.log(prefix+data.seq);
//     request.ref_no=prefix+data.seq;
// })

// doc.testvalue = counter.seq;
// AccessRequest.post("update", function(doc) {
//     console.log('Check if resolved, then send email');
//     if(doc.status==="resolved"){
//     const mailOptions = {
//         from: '"KPK IT helpdesk" <ptcl@ptcl.net>',
//         to: doc.email  };
//         mailOptions.subject = `Complaint resolved ${doc.ref_no}`;
//         mailOptions.html = `Dear student<br/>
//             Your complaint  <b>${doc.ref_no}</b> 
//             Has been resolved.
//             <br/>
//             Thank you<br/>
//             IT Department , Govt.KPK 
//             </html>
//             `;
//         sendEmailLocal(mailOptions);
//         }
//   });

function sendEmailLocal(mailOptions){
    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: "trace9.cloud@gmail.com", pass: "cloud9net" }
    });
    
    mailTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            console.log("error");
        } else {
            console.log('Email sent successfully');//,response);
        }
    });//sent
}
app.db.model('AccessRequest',AccessRequest);
}