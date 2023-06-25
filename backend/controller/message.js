const Message = require("../model/message")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const { upload } = require("../multer")
const path = require("path")
const express = require("express")

const router = express.Router()

// Create new message
router.post(
	"/create-message",
	upload.single("images"),
	catchAsyncErrors(async (req, res, next) => {
		const messageData = req.body
		if (req.file) {
			const filename = req.file.filename
			const fileUrl = path.join(filename)

			messageData.images = fileUrl
		}

		messageData.conversationId = req.body.conversationId
		messageData.sender = req.body.sender
		messageData.text = req.body.text

		const message = new Message({
			conversationId: messageData.conversationId,
			sender: messageData.sender,
			images: messageData.images ? messageData.images : undefined,
			text: messageData.text,
		})

		await message.save()

		res.status(201).json({
			success: true,
			message,
		})
		try {
		} catch (error) {
			return next(new ErrorHandler(error.message, 400))
		}
	})
)

// get all messages with conversation Id

router.get(
	"/get-all-messages/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const messages = await Message.find({ conversationId: req.params.id })

			res.status(200).json({
				success: true,
				messages,
			})
		} catch (error) {
			next(new ErrorHandler(error.message, 500))
		}
	})
)

module.exports = router
