exports= module.exports = function(app, mongoose) {

var express= require ('express');
var router = express.Router();

let path=require('path');
app.use(express.static(path.join(__dirname+'/../KPKApp/', 'build')));
router.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname+'/../KPKApp/', 'build', 'index.html'));
  });
// router.get('/', function(req,res,next){
    
//     res.render('index',{title:'Express'}) ;
// });

router.post('/access',function (req,res) {
    console.log(req.body);
    res.status(200).send("Muhammad")
    
});

app.use('/',router);
}