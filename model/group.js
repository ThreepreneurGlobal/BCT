const { Schema, model } = require("mongoose");


const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        line01: {
            type: String,
            required: true
        },
        line02: {
            type: String
        },
        tah: {
            type: String,
            required: true
        },
        dist: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        }
    },
    date: {
        type: Date,
    },
    team: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    cashAmt:{
        type:Number,
        default:0
    },
    bank: [{
        account: {
            type: Number
        },
        name: {
            type: String
        },
        branch: {
            type: String
        },
        ifsc: {
            type: String
        },
        amount: {
            type: Number,
            default: 0
        }
    }],
    transactions:[{
        type:Schema.Types.ObjectId,
        ref:"transactions"
    }],
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = model("groups", groupSchema);