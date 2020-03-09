exports = module.exports = function (app, mongoose) {

    'use strict';
    var Schema = mongoose.Schema;
    const loggedinUser = new Schema({
        databaseToken: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        adminId: {
            type: String,
            required: true,
        },
        expire_at:
        {
            type: Date,
            default: Date.now,
            expires: 86400//Time in Seconds To Expire The Token
        }
    });
    app.db.model('loggedinAdmin', loggedinUser);
}