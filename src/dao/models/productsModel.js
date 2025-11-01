const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
        },  
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        thumbnails: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(
    "products", 
    productSchema
);

module.exports = { ProductModel };