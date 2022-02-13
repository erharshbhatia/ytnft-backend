const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MintedVideo = mongoose.model("MintedVideo");
const OpenSeaData = mongoose.model("OpenSeaData")
const User = mongoose.model("User");
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")
Sentry.init({
  dsn: "https://c02b35096a7643918935df6ba29d3a58@o1108130.ingest.sentry.io/6138385",
  tracesSampleRate: 1.0,
});

router.get("/mintedVideo/:tokenId", (req, res) => {
    console.log(req.params.tokenId)
    MintedVideo.findOne({ tokenId: req.params.tokenId })
        .then(mintedVideo => res.json(mintedVideo))
        .catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
});

router.get("/openseadata/:tokenId", (req, res) => {
    console.log(req.params.tokenId)
    MintedVideo.findOne({ tokenId: req.params.tokenId })
        .then((mintedVideo) => {
            OpenSeaData.findOne({ _id: mintedVideo.openSeaData})
            .then((data)=>{
                res.json(data)
            })
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
});

router.post("/addMintedVideo", (req, res) => {
    console.log(req.body + "This is")
    const { tokenId, videoId, videoTitle, views, dateStamp, videoThumbnailUrl, ownerEmail , nftDescription, 
    nftImage, nftName, nftAttributes, externalUrl} = req.body;
    try {
        console.log(nftAttributes)
      } catch (e) {
        Sentry.captureException(e);
      }
    
    if (!tokenId || !videoId || !videoTitle || !views || !dateStamp || !videoThumbnailUrl || !ownerEmail
        || !nftDescription || !nftImage || !nftName  || !externalUrl || !nftAttributes) {
        res.status(422).json({ error: "Please add all the fields" });
    }
    MintedVideo.findOne({ tokenId: tokenId })
        .then((mintedVideo) => {
            if (mintedVideo) {
                res.status(422).json({ error: "Video already exists, get its metadata from get request." });
            }
            else {
                const newOpenSeaData = new OpenSeaData({
                    attributes: nftAttributes,
                    description: nftDescription,
                    image: nftImage,
                    name: nftName,
                    external_url: externalUrl
                })
                newOpenSeaData.save()
                .then((data)=>{
                    const newVideo = new MintedVideo({
                        tokenId: tokenId,
                        videoId: videoId,
                        videoTitle: videoTitle,
                        views: views,
                        dateStamp: dateStamp,
                        videoThumbnailUrl: videoThumbnailUrl,
                        ownerEmail: ownerEmail,
                        openSeaData: data._id,
                    });
                    newVideo
                    .save()
                    .then((user) => {
                        res.json(user);
                        User.findOneAndUpdate({email: ownerEmail}, {$push :{mintedVideos : user._id}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Error in updating minted vdo array in User schema!");
                            }
                            console.log("Updated User::  "+doc);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
        })
        .catch((err) => console.log(error));
});
module.exports = router;