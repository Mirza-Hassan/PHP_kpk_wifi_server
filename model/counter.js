'use strict';

module.exports = function(app,mongoose){

var CounterSchema = new mongoose.Schema({

    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
app.db.model('Counter',CounterSchema);
}