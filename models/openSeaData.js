const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const openSeaDataSchema = new mongoose.Schema({
    attributes: [{
        trait_type: String,
        value: String
    }],
    description: {
        type: String
    },
    external_url: {
        type: String
    },
    image: {
        type: String
    },
    name: {
        type: String
    }

})


mongoose.model("OpenSeaData", openSeaDataSchema)
