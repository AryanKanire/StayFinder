if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const session = require("express-session");
const mongostore = require("connect-mongo");
const flash = require("connect-flash"); 
const listingrouter = require("./routes/listing");
const reviewrouter = require("./routes/reviews");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user");
const userrouter = require("./routes/user");

const dburl = process.env.ATLASDB_URL

main().then(()=>{
    console.log("connected to db")
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dburl);
}

app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"public")));

const store = mongostore.create({
    mongoUrl : dburl,
    crypto:{
        secret:process.env.Secret,
    },
    touchAfter:24*60*60,
})

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})

const sessionOption = {
    store,
    secret : process.env.Secret,
    resave : false,
    saveUninitialized:true,
    Cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash('error');
    res.locals.curruser = req.user;
    next();
})

app.use("/listing",listingrouter);

app.use("/listing/:id/reviews",reviewrouter);

app.use("/",userrouter);



// app.all("*",(req,res,next)=>{
//     next(new expresserror(404,"page not found"));
// })

// app.use((err,req,res,next)=>{
//     let{statuscode, message} = err
//     res.render("error",{message})
// })

app.listen(3000)
