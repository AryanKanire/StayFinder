const listing = require("../models/listing");
const expresserror = require("../utils/expresserror")

module.exports.index = async (req,res)=>{
    const alllisting = await listing.find({});
    res.render("listing/index",{alllisting});
}

module.exports.renderNewform = (req,res)=>{
    res.render("listing/new");
}

module.exports.showlisting = async (req,res)=>{
    let {id} = req.params;
    const home = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!home) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }
    res.render("listing/show",{home});
}

module.exports.createlisting = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    if(!req.body.listing){
        throw new expresserror(404,"send valid data");
    }
    const newlisting =new listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url , filename};
    await newlisting.save();
    req.flash("success","new listing created");
    res.redirect("/listing");
}

module.exports.renderEditform = async(req,res)=>{
    let {id} = req.params;
    const home = await listing.findById(id)
    res.render("listing/edit",{home})
}

module.exports.updatelisting = async (req,res)=>{
    let {id} = req.params;
    let editlisting = await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        editlisting.image = {url , filename};
        await editlisting.save();
    }
    res.redirect(`/listing/${id}`);
}

module.exports.deletelisting = async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}