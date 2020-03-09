'use strict';

module.exports = function(app,mongoose){
const nodemailer = require('nodemailer');
var Complain = new mongoose.Schema({
// name:{
//     type:String,
//     require: true,
//     minlength: 3
// },
// roll_number:{
//     type:String,
//     minlength:3
// },
// college:{
//     type:String,
//     require: true,
//     minlength:3
// },
// phone:{
//     type:String,
//     require: true,
//     minlength:3
// },
// email:{
//     type:String,
//     require:true,
//     minlength: 3
// },
status:{
    type:String,
    require: true,
    defautl:"pending"
},
comment:{
    type:String,
    require: true,
    minlength:3 
},
acknowledge_comment:{
    type:String,
},
ref_no:{
    type:String,
    require: true,
},
request_ref_no:{
    ref: 'AccessRequest',
    type:String,
    require:true
},
username:{
    ref: 'NetworkUser',
    type:String,
    require:true
},
created:{
    type: Date,
    default: Date.now,
},
updated:{
    type: Date,
},
updatedb_by:{ 
    type: String,
    require:false
}
});
Complain.pre('save' ,  function(next){
    console.log('Huraray pre save called~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

    var doc = this;
    var prefix;
    app.db.model('AccessRequest').findOne({"ref_no":doc.request_ref_no},{},(err , request_doc)=>{
        console.log('found this request for ref no', request_doc);
        if(err){
            console.log('Error, request not found by reference number =',doc.request_ref_no );
            return;    
        }
    app.db.model('Counter').findByIdAndUpdate({_id: 'Complain'},
        {$inc: { seq: 1} },{upsert:true} , function(error, counter){
    if(error)
        return next(error);
     app.db.model('College').findOne({"name":request_doc.college}, function (err, college) {
        //console.log('prefix=',doc);
    if(!college)
        return next("college not found");
    prefix=college.id_prefix;
    console.log('got=~~~~~~',prefix+counter.seq);
    doc.ref_no=prefix+counter.seq;
    next();
    });
    });
});
});

Complain.post("update", function(next) {
    var doc = this;
console.log('Huraray post update called~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
next();

});


// Complain.post("update", function(doc) {
//     console.log('Check if resolved, then sending email~~',doc.status);
//     if(doc.status==="acknowledged"){
//     app.db.model('AccessRequest').findOne({"request_ref_no":doc.request_ref_no},{},(err,request_doc)=>{
//         console.log('AccessRequest found,now sending email=',request_doc);
//     const mailOptions = {
//         from: '"KPK IT helpdesk" <ptcl@ptcl.net>',
//         to: request_doc.email  };
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
//         });//findOne
//     }
//   });

  Complain.post("save", function(doc) {
    console.log('send email for complain');
    
    app.db.model('AccessRequest').findOne({"ref_no":doc.request_ref_no},{},(err,request_doc)=>{
            if(err)
                console.log('Error, the request ref for the compain is not found',doc.request_ref_no);
            else{
            const mailOptions = {
                from: '"KPK IT helpdesk" <ptcl@ptcl.net>',
                to: request_doc.email  };
                mailOptions.subject = `Complaint registered for Request# ${doc.ref_no}`;
                mailOptions.html = `Dear student<br/>
                    Your complaint has been registered
                    <br/> Your compain number is:<b>${doc.ref_no}</b> 
                    Has been registered.
                    <br/>
                    Thank you<br/>
                    </html>
                    `;
                sendEmailLocal(mailOptions);
            }
    });
        });



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
            console.log('Email sent successfully',JSON.stringify(response));
        }
    });//sent
    }

app.db.model('Complain',Complain);
}