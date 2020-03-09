exports = module.exports = function (app, mongoose) {
    var validator = require('validator');
    'use strict';
    var Schema = mongoose.Schema;
    const admin = new Schema({
        userName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email'
            }
        },
        phoneNumber: {
            type: String,
            required: true
        },
        college:{
            type: Schema.Types.ObjectId, 
            ref: 'College'
        },
        role: {
            type: String,
            enum: ["SuperAdmin", "Admin"],
            required: true
        }
        // role: [{type:Schema.Types.ObjectId , ref:'UserAdmin'}]
    }); 

    // admin.post('save', function(error, doc, next) {
    //     if (error.name === 'MongoError' && error.code === 11000) {
    //       next(new Error('There was a duplicate key error'));
    //     } else {
    //       next(error);
    //     }
    //   });

    //   admin.pre('save', function(error, doc, next) {
    //     if (error.name === 'MongoError' && error.code === 11000) {
    //       next(new Error('There was a duplicate key error'));
    //     } else {
    //       next(error);
    //     }
    //   });
    app.db.model('Admin', admin);
}