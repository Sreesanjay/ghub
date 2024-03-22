const { default: mongoose } = require("mongoose");

const reviewRateModel = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        rating: {
            type: Number,
        },
        review: {
            type: String,
        }
    }
)

module.exports = mongoose.model("ReviewRate", reviewRateModel);
