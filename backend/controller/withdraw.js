const Withdraw = require("../model/withdraw")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth")

const express = require("express")
const sendMail = require("../utils/sendMail")
const Shop = require("../model/shop")
const router = express.Router()

// create withdraw request -- only for seller

router.post(
	"/create-withdraw-request",
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { amount } = req.body
			const data = {
				seller: req.seller,
				amount,
			}

			try {
				await sendMail({
					email: req.seller.email,
					subject: "Withdraw Request",
					message: `Hello ${req.seller.name}, Your withdrawal request of ${amount}$ have been is Accepted. \nIt will take 3 days to processing!. \n\nDo not reply to this email it is auto generated. \n\nThank you`,
				})
			} catch (error) {
				return next(new ErrorHandler(error.message, 500))
			}

			const withdraw = await Withdraw.create(data)

			const shop = await Shop.findById(req.seller._id)
			if (!shop) return next(new ErrorHandler("Can't find a shop", 400))

			shop.availableBalance = shop.availableBalance - amount
			await shop.save()
			res.status(201).json({
				success: true,
				withdraw,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// get all withdraws --- admnin

router.get(
	"/get-all-withdraw-request",
	isAuthenticated,
	isAdmin("Admin"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const withdraws = await Withdraw.find().sort({ createdAt: -1 })

			res.status(201).json({
				success: true,
				withdraws,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// update withdraw request ---- admin
router.put(
	"/update-withdraw-request/:id",
	isAuthenticated,
	isAdmin("Admin"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { sellerId } = req.body

			const withdraw = await Withdraw.findByIdAndUpdate(
				req.params.id,
				{
					status: "succeed",
					updatedAt: Date.now(),
				},
				{ new: true }
			)

			const seller = await Shop.findById(sellerId)

			const transaction = {
				_id: withdraw._id,
				amount: withdraw.amount,
				updatedAt: withdraw.updatedAt,
				status: withdraw.status,
			}

			seller.transactions = [...seller.transactions, transaction]

			await seller.save()

			try {
				await sendMail({
					email: seller.email,
					subject: "Payment confirmation",
					message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. \nDelivery time depends on your bank's rules it usually takes 3days to 7days. \n\n Thank you`,
				})
			} catch (error) {
				return next(new ErrorHandler(error.message, 500))
			}
			const withdraws = await Withdraw.find().sort({ createdAt: -1 })
			res.status(201).json({
				success: true,
				withdraws,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)
module.exports = router
