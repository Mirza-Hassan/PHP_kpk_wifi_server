module.exports= function(app,mongoose){


var express= require('express');
var router = express.Router();
var bodyParser= require('body-parser');
router.use(bodyParser.json());

router.get('/college',function (req,res) {
    var x= app.db.model('College');
    x.find({}, function(err, colleges) {
        res.send({colleges});  
      });
});

router.get('/college/:id',function (req,res) {
    var x= app.db.model('College');
    x.findById(req.params.id, function(err, college) {
        res.status(200).send({college}); ``
      });
});

//update
router.put(`/college`,(req,res)=>{
    const formData=req.body.formData;
    var query = { _id: formData._id };
    // console.log("data=",formData);
    var R= app.db.model('College');
    R.findOneAndUpdate(query,formData,{new:true}, function (err, college) {
        if(!college){
            res.status(200).send({ success: false, message: `Error: Not found`});
        }
        else{
            console.log("updated data=",college);
            res.status(200).send({ success: true, message:"Updated successfully",userData: college});
        }
    });
})

//creating college
router.post('/college/create',function (req,res) {
    // var request=new app.db.models.AccessRequest({
    //     fullName: req.body.fullName,
    //     nic:req.body.nic,
    //     rollno:req.body.rollno
    // });
    // console.log('request=',req.body);
        
    // console.log(req.body);
    var new_college=new app.db.models.College(
        req.body.formData
    );
    new_college.save(function (err) {
        if (err) {
       res.status(200).send({ success: false, message: `Something went wrong!`,err});
        }
        else{
        res.status(200).send({ success: true, message: `College created successfully`});
        }
});
});

router.post('/college/delete',function (req,res) {

    
    const x= app.db.model('College');
    // console.log(req.body);
    x.deleteOne({ _id: req.body._id }, function (err) {
        if(err){
            res.status(200).send({ success: false, message: `Something went wrong!`,err});
        }
        else
        res.status(200).send({ success: true, message: `College ${req.body._id} deleted successfully` });
    })
    });
    // x.findById(req.body._id, function (err, doc) {
    //     if (err) {
    //         // handle error
    //     }
    //     console.log(doc);
        
    //    // doc.remove(callback); //Removes the document
    // })

app.use('/api/v1',router);
}