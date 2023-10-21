const { Schema, model } = require("mongoose");


const bankSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    ifsc: {
        type: String,
        required: true
    },
    group:{
        type:Schema.Types.ObjectId,
        ref:"groups"
    },
    account: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = model("bank", bankSchema);