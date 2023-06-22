const express = require("express")
const router = express.Router()
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const stripe = require("stripe")(process.env.STRIPE_SCRETE_KEY)

router.post(
	"/process",
	catchAsyncErrors(async (req, res, next) => {
		const myPayment = await stripe.paymentIntents.create({
			amount: req.body.amount,
			currency: "usd",
			metadata: {
				company: "Quentech",
			},
		})

		res.status(201).json({
			success: true,
			client_secret: myPayment.client_secret,
		})
	})
)

// get api key
router.get(
	"/stripeapikey",
	catchAsyncErrors(async (req, res, next) => {
		const apikey = process.env.STRIPE_PUBLISHABLE_KEY

		res.status(200).json({
			success: true,
			stripeApiKey: apikey,
		})
	})
)

module.exports = router
