'use strict';

module.exports = function(app,mongoose){

var College = new mongoose.Schema({

name:{
    type:String,
    require: true,
    minlength: 3
},
poc_name:{
    type:String,
    require:true,
    minlength: 3
},
poc_contact:{
    type: String,
    require: true,
    minlength: 3
},
poc_email:{
    type: String,
    require: true,
    minlength: 3
},
city:{
    type: String,
    require: true,
    minlength: 3
},
address:{
    type: String,
    require: true,
    minlength: 3
},
id_prefix:{
    type: String,
    require: true,
    minlength: 3 
}
});
app.db.model('College',College);
}