const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MintedVideo = mongoose.model("MintedVideo");
const User = mongoose.model("User");
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")
Sentry.init({
  dsn: "https://c02b35096a7643918935df6ba29d3a58@o1108130.ingest.sentry.io/6138385",
  tracesSampleRate: 1.0,
});



router.get("/mintedVideo/:tokenId", (req, res) => {
    MintedVideo.findOne({ tokenId: req.params.userId })
        .then(mintedVideo => res.json(mintedVideo))
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
                const newVideo = new MintedVideo({
                    tokenId: tokenId,
                    videoId: videoId,
                    videoTitle: videoTitle,
                    views: views,
                    dateStamp: dateStamp,
                    videoThumbnailUrl: videoThumbnailUrl,
                    ownerEmail: ownerEmail,
                    nftAttributes: nftAttributes,
                    nftDescription: nftDescription,
                    nftImage: nftImage,
                    nftName: nftName,
                    externalUrl: externalUrl
                });
                newVideo
                    .save()
                    .then((user) => {
                        res.json(user);
                        User.findOneAndUpdate({email: ownerEmail}, 
                            {$push :{mintedVideos : user._id}}, 
                            {new: true}, 
                            (err, doc) => {
                            if (err) {
                                console.log("Error in updating minted vdo array in User schema!");
                            }
                            console.log(doc);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                //console.log(newVideo._id)

               

            }
        })
        .catch((err) => console.log(error));
});
module.exports = router;