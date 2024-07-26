const listing = require("../models/listing");
const Review = require("../models/review");
const expresserror = require("../utils/expresserror");


module.exports.createreview = async(req, res) => {
    // const { id } = req.params;
    const flat = await listing.findById(req.params.id);
    if (!flat) {
        throw new expresserror(404, "Listing not found");
    }
    
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    flat.reviews.push(newReview._id);

    await newReview.save();
    await flat.save();
    
    res.redirect(`/listing/${flat._id}`);
}


module.exports.destroyreview = async (req,res)=>{
    let {id, reviewId} = req.params;

    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`)
}