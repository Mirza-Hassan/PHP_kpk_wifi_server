'use strict';

module.exports = function(app,mongoose){
//todo: centralize the mailer
const nodemailer = require('nodemailer');


var User = new mongoose.Schema({
username:{
    type:String,
    require: true,
    unique: true,
    dropDups:true,
    minlength:3,
},
password:{
    type:String,
    require:true,
    minlength: 3
},
request_ref_no:{
    type: String,
    require: true,
    unique: true,
    dropDups:true,
},
created:{
    type: Date,
    default: Date.now,
},
created_by: {
    type: String,
    minlength: 3
},
//6month expiry for now
expire_at:{
    type: Date,
    default: Date.now,
    expires: '180d'//Time in Seconds To Expire The document
}
});
// Foreign keys definitions
// User.virtual('request_ref_no', {
//     ref: 'AccessRequest',
//     localField: 'request_ref_no',
//     foreignField: 'ref_no',
//     justOne: true // for many-to-1 relationships
//   });

User.pre('save',  function(next) {
    var doc = this;
    doc.created=Date.now();
    next();
});

// User.on('index', function(err) {
//     if (err) {
//         console.error('User index error: %s', err);
//     } else {
//         console.info('User indexing complete');
//     }
// });
// mongoose.set('debug', true);
User.post('save', function(doc) {
    app.db.model('AccessRequest').findById({_id: doc.request_ref_no}, function(error, request){
            if(!request)
                return;
            const mailOptions = {
            from: '"Wifi Access" <ptcl@ptcl.net>',
            to: request.email,
            }; 
            mailOptions.subject = 'Congratulations, wifi user created';
            mailOptions.html = 
                `<html>
                Dear user<br/>
                Your wifi access request is acknowledged. Here are your credentials<br/>
                Username: ${doc.username}<br/>
                Password: ${doc.password}<br/>
                </html>
                `;
                sendEmailLocal(mailOptions); //sent
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
            console.log('Email sent successfully',response);
        }
    });//sent
}




app.db.model('NetworkUser',User);

}