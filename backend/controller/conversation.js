const Conversation = require("../model/conversation")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const express = require("express")
const { isSeller, isAuthenticated } = require("../middleware/auth")
const router = express.Router()

// create conversations
router.post(
	"/create-conversation",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { groupTitle, userId, sellerId } = req.body

			const isConversation = await Conversation.findOne({ groupTitle })

			if (isConversation) {
				res.status(200).json({
					success: true,
					conversation: isConversation,
				})

				return next()
			}

			const conversation = await Conversation.create({
				members: [userId, sellerId],
				groupTitle,
			})

			res.status(200).json({
				success: true,
				conversation,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// get all conversations of  seller
router.get(
	"/get-all-conversations-seller/:sellerId",
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const conversations = await Conversation.find({
				members: {
					$in: [req.params.sellerId],
				},
			}).sort({ updatedAt: -1, createdAt: -1 })

			res.status(200).json({
				success: true,
				conversations,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// get all conversations of  user
router.get(
	"/get-all-conversations-user/:userId",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const conversations = await Conversation.find({
				members: {
					$in: [req.params.userId],
				},
			}).sort({ updatedAt: -1, createdAt: -1 })

			res.status(200).json({
				success: true,
				conversations,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// update last message
router.put(
	"/update-last-message/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { lastMessage, lastMessageId } = req.body

			const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
				lastMessage,
				lastMessageId,
			})

			res.status(200).json({ success: true, conversation })
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

module.exports = router
