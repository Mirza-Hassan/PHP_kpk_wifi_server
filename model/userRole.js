exports = module.exports = function (app, mongoose) {
    'use strict';
    var Schema = mongoose.Schema;
    const role = new Schema({
        path: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
            required: true
        }
    });
    app.db.model('UserRole', role);
}