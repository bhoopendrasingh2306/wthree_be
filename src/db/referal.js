// const { Double } = require("bson");
const mongoose = require("mongoose");

const referalSchema = new mongoose.Schema({
    name:String,
    srno:Number,
    email:String,
    selfearning:Number,
    referralEarning:Number,
    rewardEarning:Number,
    amount:Number,
    details:String,
    userStatus:String,
    Date:String,
    img_url:{
        require:false,
        type:String,
    },
});

module.exports = mongoose.model("referal",referalSchema);