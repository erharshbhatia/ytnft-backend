const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const mintedVideoSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    videoTitle: {
        type: String,
        required: true
    },
    views: {
        type: String,
        required: true
    },
    dateStamp: {
        type: String,
        required: true
    },
    videoThumbnailUrl: {
        type: String,
        required: true
    },
    videoOwner: {
        type: ObjectId, 
        ref: "User"
    },
    ownerEmail: {
        type: String,
        required: true
    },
    nftDescription: {
        type: String
    },
    nftImage: {
        type: String
    },
    nftName: {
        type: String
    },
    externalUrl: {
        type: String
    },
    nftAttributes: {
        type: String
    }
})
// description
// attributes array= containing json of {trait_type, value}
// external_url
// image_nft
// name_nft


mongoose.model("MintedVideo", mintedVideoSchema)
