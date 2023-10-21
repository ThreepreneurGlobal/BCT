const { Schema, model } = require("mongoose");



const transactionSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    transType: {                    // Debit || Loan or Credit || Saving
        type: String,
    },
    mode:{                          // Cheque || Online || Cash
        type:String
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "groups"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    amount: {
        number: {
            type: Number,
            required: true
        },
        word: {
            type: String
        }
    },
    cheque: {
        chqNumber: {
            type: String,
        },
        chqDate: {
            type: Date,
        },
        chqIfsc:{
            type:String,
        }
    },
    onlineTrans:{
        transId:{
            type:String,
        },
        transDate:{
            type:Date,
        }
    },
    description: {
        type: String
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});


module.exports = model("transactions", transactionSchema);