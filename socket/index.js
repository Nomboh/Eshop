const socketIO = require("socket.io")
const http = require("http")
const express = require("express")
const cors = require("cors")
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const dotenv = require("dotenv")

dotenv.config({ path: "./.env" })

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
	res.send("Hello World")
})

let users = []

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId })
}

// define a message property with a seen propery

const createMessage = ({ senderId, receiverId, text, images }) => ({
	senderId,
	receiverId,
	text,
	images,
	seen: false,
})

const getUser = (userId) => {
	return users.find((user) => user.userId === userId)
}

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId)
}

io.on("connection", (socket) => {
	// on connect
	console.log("a user is connected")

	// take userId and socketId from user
	socket.on("addUser", (userId) => {
		addUser(userId, socket.id)
		io.emit("getUsers", users)
	})

	// send and get messages
	const messages = {}

	socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
		const message = createMessage({
			senderId,
			receiverId,
			text,
			images,
		})

		const user = getUser(receiverId)

		// Store the messages in the messages object
		if (!messages[receiverId]) {
			messages[receiverId] = [message]
		} else {
			messages[receiverId].push(message)
		}

		// send the message to the reciever

		io.to(user?.socketId).emit("getMessage", message)
	})

	socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
		const user = getUser(senderId)

		// update the seen
		if (messages[senderId]) {
			const message = messages[senderId].find(
				(item) => item.id === messageId && item.receiverId === receiverId
			)

			if (message) {
				message.seen = true

				// send a message seen event
				io.to(user?.socketId).emit("messageSeen", {
					senderId,
					receiverId,
					messageId,
				})
			}
		}
	})

	// update and get lastMessage
	socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
		io.emit("getLastMessage", {
			lastMessage,
			lastMessageId,
		})
	})

	// on disconnect
	socket.on("disconnect", () => {
		console.log("user disconnected!!")
		removeUser(socket.id)
		io.emit("getUsers", users)
	})
})

server.listen(process.env.PORT || 5500, () => {
	console.log(`server is listening on port ${process.env.PORT || 5500}`)
})
