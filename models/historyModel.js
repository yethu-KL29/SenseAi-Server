const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    history: {
        type: String,
        required: true,
        trim: true,
        
    }


},{timestamps: true})
const History = mongoose.model('History', historySchema);
module.exports = History;
