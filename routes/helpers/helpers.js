// module.exports= function(app){
    const nodemailer = require('nodemailer');
    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: "trace9.cloud@gmail.com", pass: "cloud9net" }
    });
    
    function sendEmail(mailOptions) {
        mailTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                console.log(`error while sending to ${mailOptions.to}`);
            } else {
                console.log(`Email sent successfully to ${mailOptions.to}`);
            }
        });//sent
    }
    module.exports=sendEmail;
    // const nodemailer=require('nodemailer');

    //  function  sendEmailLocal(mailOptions) {
    //   const mailTransport = nodemailer.createTransport({
    //       service: 'gmail',
    //       auth: { user: "trace9.cloud@gmail.com", pass: "cloud9net" }
    //   });
      
    //   mailTransport.sendMail(mailOptions, function (error, response) {
    //       if (error) {
    //           console.log(error);
    //           console.log("error");
    //       } else {
    //           console.log('Email sent successfully',JSON.stringify(response));
    //       }
    //   });//sent
    //   }


    //   module.exports=sendEmailLocal;
//     this.getCollegePrefix=function(name){
//         console.log('getCollegePrefix=',name);
//         app.db.model('College').findOne({"name":name},{},(err,doc)=>{
//             console.log('prefix=',doc);
//             return doc.id_prefix;
//         })
//     }
// }
//  module.exports.getCollegePrefix=  function(app,name){
//             // /console.log('getCollegePrefix=',name);
//     app.db.model('College').findOne({"name":name},{},(err,doc)=>{
//         console.log('prefix=',doc);
//          doc.id_prefix;
//     })
//     }

  



// module.exports.sendmail=function(app,mailOptions){
//     console.log('sending email via=',app.get('gmailEmail'),app.get('gmailPassword'));
//     const nodemailer = require('nodemailer');
//     const gmailEmail = app.get('gmailEmail');
//     const gmailPassword = app.get('gmailPassword');
//     const mailTransport = nodemailer.createTransport({
//     host:'smtp.gmail.com',
//     service: 'gmail',
//     auth: {user: gmailEmail, pass: gmailPassword,}, });

//     mailTransport.sendMail(mailOptions, function (error, response) {
//         if (error) {
//             console.log(error);
//             console.log("error");
//         } else {
//             console.log('Email sent successfully');
//         }
//     })
// }

// // module.exports.updateAndGetCounter = function(app,modelName){
// //             switch(modelName){
// //                 case "AccessRequest":{
// //                     app.db.model("RequestCounter").update({})
// //                 }
// //             }
            
// //     }
