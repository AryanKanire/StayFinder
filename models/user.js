const mongoose = require("mongoose");
const passportmongoose = require("passport-local-mongoose"); 

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require:true,
    }
})

userSchema.plugin(passportmongoose);

module.exports = mongoose.model("user",userSchema);