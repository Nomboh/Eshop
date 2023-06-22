const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema(
	{
		members: Array,
		lastMessage: String,
		lastMessageId: String,
		groupTitle: String,
	},
	{
		timestamps: true,
	}
)

const Conversation = mongoose.model("Conversation", conversationSchema)
module.exports = Conversation
