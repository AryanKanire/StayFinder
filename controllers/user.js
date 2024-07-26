const User = require("../models/user");


module.exports.rendersignup = (req,res)=>{
    res.render("users/signup");
}

module.exports.registeruser = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newuser = new User({email, username})
        const registeruser = await User.register(newuser,password);
        req.login(registeruser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","user id created");
            res.redirect("/listing");
        })
    }
    catch(err){
        if (err.name === 'UserExistsError') {
            req.flash("error", "User with this username already exists");
        } else {
            req.flash("error", err.message);
        }
        res.redirect("/signup");
    }
}

module.exports.renderlogin = (req,res)=>{
    res.render("users/login");
}

module.exports.loginuser = (req,res)=>{
    req.flash("success","Welocme to back")
    let redirectURL = res.locals.redirectUrl || "/listing";
    res.redirect(redirectURL);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listing");
    })
}