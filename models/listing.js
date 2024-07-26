const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
      await Review.deleteMany({_id:{$in: listing.reviews}});
  }
})

module.exports = mongoose.model("listing",listingSchema);