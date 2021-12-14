const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MintedVideo = mongoose.model("MintedVideo");
const User = mongoose.model("User");

router.get("/mintedVideo/:tokenId", (req, res) => {
    MintedVideo.findOne({ tokenId: req.params.userId })
        .then(mintedVideo => res.json(mintedVideo))
        .catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
});

router.post("/addMintedVideo", (req, res) => {
    console.log(req.body + "This is")
    const { tokenId, videoId, videoTitle, views, dateStamp, videoThumbnailUrl, ownerEmail } = req.body;

    if (!tokenId || !videoId || !videoTitle || !views || !dateStamp || !videoThumbnailUrl || !ownerEmail) {
        res.status(422).json({ error: "Please add all the fields" });
    }
    MintedVideo.findOne({ tokenId: tokenId })
        .then((mintedVideo) => {
            if (mintedVideo) {
                res.status(422).json({ error: "Video already exists, get its metadat from get request." });
            }
            else {
                const newVideo = new MintedVideo({
                    tokenId: tokenId,
                    videoId: videoId,
                    videoTitle: videoTitle,
                    views: views,
                    dateStamp: dateStamp,
                    videoThumbnailUrl: videoThumbnailUrl,
                    ownerEmail: ownerEmail
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