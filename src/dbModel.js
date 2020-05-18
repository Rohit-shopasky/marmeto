const mongoose = require("./config");

const user = new mongoose.Schema({
    firstName: String,
    lastName: { type: String },
    email:{type:String},
    mob: { type: Number },
    password:{ type: String },
    token:{type:String},
    isVerified:{type:Boolean,default:false},
    emailVerificationTime:{type: Date, default:new Date()},
    createdAt: { type: Date, default: new Date() },
    updatedAt:{type:Date}
})


const Schemas = {
    userModel: mongoose.model('Users', user),
}

module.exports = Schemas;