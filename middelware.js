const listing = require("./models/listing");
const review  = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You are not logged in");
        return res.redirect("/login")
    }
    next();
} 

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}
 
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let editlisting = await listing.findById(id);
    if (!editlisting) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // or any appropriate route
    }
    if(!editlisting.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","you don't have authorite to edit it!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if(!Review.author.equals(res.locals.curruser._id)){
        req.flash("error","you don't have authorite to delete it!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}