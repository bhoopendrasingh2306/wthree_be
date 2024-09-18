// const { Double } = require("bson");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:String,
    srno:Number,
    email:String,
    password:String,
    selfEarning: Number,
    referralEarning:Number,
    rewardEarning:Number,
    amount:Number,
    details:String,
    userStatus:String,
    date:String,
    img_url:{
        require:false,
        type:String,
    },
});

module.exports = mongoose.model("user",userSchema);