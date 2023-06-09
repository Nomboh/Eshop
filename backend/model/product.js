const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, "Please enter your product name"],
		},

		description: {
			type: String,
			require: [true, "Please enter your product descriptin"],
		},

		category: {
			type: String,
			require: [true, "Please enter your product category"],
		},

		tags: String,

		originalPrice: Number,

		discountPrice: {
			type: Number,
			require: [true, "Please enter your product Price"],
		},

		stock: {
			type: String,
			require: [true, "Please enter your product Stock"],
		},

		images: [
			{
				type: String,
			},
		],

		shop: {
			type: Object,
			required: [true, "Seller is required"],
		},

		shopId: {
			type: String,
			require: [true, "Seller Id is required"],
		},

		sold_out: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("Product", productSchema)
