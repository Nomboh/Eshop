const express = require("express")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const { isSeller } = require("../middleware/auth")
const router = express.Router()
const Product = require("../model/product")
const Shop = require("../model/shop")
const { upload } = require("../multer")
const ErrorHandler = require("../utils/ErrorHandler")
const fs = require("fs")
const shop = require("../model/shop")

// Create Products
router.post(
	"/create-product",
	upload.array("images"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.body.shopId

			const shop = await Shop.findById(shopId)
			if (!shop) {
				return next(new ErrorHandler("ShopId is invalic", 400))
			} else {
				const files = req.files
				const imagesUrl = files.map((file) => `${file.filename}`)
				const productData = req.body
				productData.images = imagesUrl
				productData.shop = shop

				const product = await Product.create(productData)

				res.status(201).json({
					success: true,
					product,
				})
			}
		} catch (error) {
			return next(new ErrorHandler(error, 400))
		}
	})
)

// Get all products of a shop
router.get(
	"/get-all-product-shop/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const products = await Product.find({ shopId: req.params.id })

			res.status(200).json({
				success: true,
				products,
			})
		} catch (error) {
			return next(new ErrorHandler(error, 400))
		}
	})
)

// Delete a product
router.delete(
	"/delete-shop-product/:id",
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const productId = req.params.id
			const product = await Product.findById(productId)

			if (!product)
				return next(new ErrorHandler("Product not found with this id", 400))

			product.images.forEach((imagesUrl) => {
				const filename = imagesUrl
				const filePath = `uploads/${filename}`

				fs.unlink(filePath, (err) => {
					if (err) {
						console.log(err)
					}
				})
			})

			await Product.findByIdAndDelete(productId)

			res.status(200).json({
				success: true,
				message: "Product deleted successfully",
			})
		} catch (error) {
			return next(new ErrorHandler(error, 400))
		}
	})
)

// Get all products
router.get(
	"/get-all-products",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const products = await Product.find()

			res.status(201).json({
				success: true,
				products,
			})
		} catch (error) {
			return next(new ErrorHandler(error, 400))
		}
	})
)

module.exports = router
