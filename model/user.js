const { Schema, model } = require("mongoose");
const { compare, hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");



const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    amount:{
        type:Number,
        default:0
    },
    group:{
        type:Schema.Types.ObjectId,
        ref:"groups"
    },
    transactions:[{
        type:Schema.Types.ObjectId,
        ref:"transactions"
    }],
    role: {
        type: String,
        default: "user"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};


userSchema.methods.getJWToken = function () {
    return sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};



module.exports = model("users", userSchema);