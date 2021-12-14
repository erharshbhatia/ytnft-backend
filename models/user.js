const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mintedVideos:[{type: ObjectId, ref: "MintedVideo"}],
    channelImageUrl: {
        type: String,
        required: true
    }

})


mongoose.model("User", userSchema)
