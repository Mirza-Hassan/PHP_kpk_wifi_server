const sendEmail=require('./helpers/helpers'); 


function sendEmailOnVerifiedRequestToPrincipal(app,doc) {
    //console.log('Email sent');
    let mailOptions = {
        from: '"KPK IT" <ptcl@ptcl.net>',
        to: "saqib.arfeen@gmail.com",
        subject : 'Wifi request received',
        html : `
           <html>
           A new wifi access request has been received in ${doc.college}. The request id is ${doc._id}
           </html>
          `
      };
    //  let query= app.db.models.College.findOne({"name":doc.college});
     //goto college via name, then goto Admin via ID
     app.db.models.College.findOne({"name":doc.college}).exec((err,doc)=>{
        console.log('College~~~~~~~~~~',doc);
        app.db.models.Admin.findOne({"college":doc._id}).exec((err,doc)=>{
                console.log('Admin~~~~~~~~~~',doc);
                mailOptions.to=doc.email;
                sendEmail(mailOptions);
        })
     })

}

module.exports= function(app,mongoose){
    // const gmailEmail = app.get('gmailEmail');
    // const gmailPassword = app.get('gmailPassword');
    var router = require('express').Router();
    var bodyParser= require('body-parser');
    router.use(bodyParser.json());
    router.get('/request',(req,res)=>{
    var  Q= app.db.model('AccessRequest');
    console.log(req.query.id);
    const query={"_id":req.query.id};
        // Q.findById("5c1211384665333aaaa0c2b7", function(err, college) {
        //     console.log(college);
        //     res.status(200).send({college}); ``
        //   });
        Q.findOneAndUpdate(query,{$set:{ "verified":true }},{new:true}, function (err, accessRequest) {
            //send email to college principal
            sendEmailOnVerifiedRequestToPrincipal(app,accessRequest);
            res.status(200).send(`Email verified!
            <br/>Your Internet Request Reference Number is :<b>${accessRequest.ref_no}</b>
            <br/>Thank you`);
        });
});

router.get('/',(req,res)=>{
       console.log(req.protocol + '://' + req.get('host'));
       res.send("OK");
})
router.get('/test',(req,res)=>{
    
    app.db.models.AccessRequest.findOne({"_id":"KUU36"}).exec((err,doc)=>{
        console.log('Request~~~~~~~~~~~~~',doc);
        
        sendEmailOnVerifiedRequestToPrincipal(app,doc);
    })
    // const mailOptions = {
    //     from: '"KPK IT" <ptcl@ptcl.net>',
    //     to: "saqib.arfeen@gmail.com",
    //     subject : 'Verify your email!',
    //     html : `Thank you for submitting a wifi request. You will receive your credentials shortly. 
    //        Please click the below link to verify your email.
    //        <html>
    //        <br/>
    //        <a href="${req.protocol + '://' + req.get('host')}/api/v1/verify/request?id=">Verify Email</a>
    //        </html>
    //       `
    //   };
    //     mailTransport.sendMail(mailOptions, function (error, response) {
    //         if (error) {
    //             console.log(error);
    //             console.log("error");
    //         } else {
    //             console.log('Email sent successfully');
    //         }
    //     });//sent
})
app.use('/api/v1/verify',router);
}