const express = require("express")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const { isSeller } = require("../middleware/auth")
const router = express.Router()
const Product = require("../model/product")
const Order = require("../model/order")
const ErrorHandler = require("../utils/ErrorHandler")

router.post(
	"/create-order",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body
			const shopItemsMap = new Map()

			cart.forEach((element) => {
				const shopId = element.shopId
				if (!shopItemsMap.has(shopId)) {
					shopItemsMap.set(shopId, [])
				}
				shopItemsMap.get(shopId).push(element)
			})

			const orders = []

			for (const [shopId, items] of shopItemsMap) {
				const order = await Order.create({
					cart: items,
					shippingAddress,
					user,
					totalPrice,
					paymentInfo,
				})
				orders.push(order)
			}

			res.status(201).json({
				success: true,
				orders,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// get all orders of a user
router.get(
	"/get-all-orders/:userId",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const orders = await Order.find({ "user._id": req.params.userId }).sort({
				createdAt: -1,
			})

			res.status(200).json({ success: true, orders })
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// get all orders of a shop
router.get(
	"/get-seller-all-orders/:shopId",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const orders = await Order.find({
				"cart.shopId": req.params.shopId,
			}).sort({ createdAt: -1 })

			res.status(200).json({ success: true, orders })
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// update an order for a seller
router.put(
	"/update-order-status/:id",
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id)

			if (!order) return next(new ErrorHandler("Order not found ", 400))

			const updateProduct = async (id, qty) => {
				const product = await Product.findById(id)

				product.stock -= qty
				product.sold_out += qty

				await product.save({ validateBeforeSave: false })
			}

			if (order.status === "Transferred to delivery partner") {
				order.cart.forEach((item) => {
					updateProduct(item._id, item.qty)
				})
			}

			order.status = req.body.status

			if (req.body.status === "Delivered") {
				order.deliveredAt = Date.now()
				order.paymentInfo.status = "Succeeded"
			}

			await order.save({ validateBeforeSave: false })

			res.status(200).json({ success: true, order })
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// give a refund a seller
router.put(
	"/order-refund/:id",
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id)

			if (!order) return next(new ErrorHandler("Order not found ", 400))

			order.status = req.body.status

			await order.save({ validateBeforeSave: false })

			res
				.status(200)
				.json({ success: true, order, message: "Order refund successfull" })
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// order refund success
router.put(
	"/order-refund-success/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id)

			if (!order) return next(new ErrorHandler("Order not found ", 400))

			order.status = req.body.status

			await order.save({ validateBeforeSave: false })

			res
				.status(200)
				.json({ success: true, order, message: "Order refund successfull" })

			if (req.body.status === "Refund Success") {
				order.cart.forEach((cart) => {
					UpdateOrder(cart._id, cart.qty)
				})
			}

			async function UpdateOrder(id, qty) {
				const product = await Product.findById(id)

				product.stock += qty
				product.sold_out -= qty

				await product.save({ validateBeforeSave: false })
			}
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

module.exports = router