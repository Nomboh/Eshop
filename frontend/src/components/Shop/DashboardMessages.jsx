import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { backend_url, server } from "../../server"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai"
import { TfiGallery } from "react-icons/tfi"
import { format } from "timeago.js"
import styles from "../../styles/styles"
import socketIO from "socket.io-client"

const ENDPOINT = "http://localhost:5500/"

const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

function DashboardMessages() {
	const [conversations, setConversations] = useState([])
	const { seller } = useSelector((state) => state.seller)
	const [open, setOpen] = useState(false)
	const [arrivelMessage, setArrivelMessage] = useState(null)
	const [messages, setMessages] = useState([])
	const [currentChat, setCurrentChat] = useState(null)
	const [newMessage, setNewMessage] = useState("")
	const [userData, setUserData] = useState(null)
	const [onlineUsers, setOnlineUsers] = useState([])
	const [activeStatus, setActiveStatus] = useState(false)

	const scrollRef = useRef(null)

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ beahaviour: "smooth" })
	}, [messages])

	useEffect(() => {
		socketId.on("getMessage", (data) => {
			setArrivelMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: Date.now(),
			})
		})
	}, [])

	useEffect(() => {
		arrivelMessage &&
			currentChat?.members.includes(arrivelMessage.sender) &&
			setMessages((prev) => [...prev, arrivelMessage])
	}, [currentChat, arrivelMessage])

	useEffect(() => {
		const getAllSellerMessages = async () => {
			try {
				const { data } = await axios.get(
					`${server}/conversation/get-all-conversations-seller/${seller._id}`,
					{ withCredentials: true }
				)
				setConversations(data.conversations)
			} catch (error) {
				toast.error(error.response.data.message)
			}
		}

		getAllSellerMessages()
	}, [seller, messages])

	useEffect(() => {
		const getMessages = async () => {
			try {
				const { data } = await axios.get(
					`${server}/message/get-all-messages/${currentChat?._id}`
				)
				setMessages(data.messages)
			} catch (error) {
				console.log(error)
			}
		}

		getMessages()
	}, [currentChat])

	useEffect(() => {
		if (seller) {
			const sellerId = seller?._id

			socketId.emit("addUser", sellerId)

			socketId.on("getUsers", (data) => {
				setOnlineUsers(data)
			})
		}
	}, [seller])

	const onlineCheck = (chat) => {
		const chatMember = chat.members.find((m) => m.id !== seller._id)
		const online = onlineUsers?.find((ou) => ou.userId === chatMember)
		return online ? true : false
	}

	const sendMessageHandler = async (e) => {
		e.preventDefault()

		const message = {
			sender: seller._id,
			text: newMessage,
			conversationId: currentChat._id,
		}

		const receiverId = currentChat.members.find(
			(member) => member !== seller._id
		)

		socketId.emit("sendMessage", {
			senderId: seller._id,
			receiverId,
			text: newMessage,
		})

		try {
			if (newMessage !== "") {
				const { data } = await axios.post(
					`${server}/message/create-message`,
					message
				)

				setMessages([...messages, data.message])
				updateLastMessage()
			}
		} catch (error) {
			console.log(error)
			// toast.error(error.response.data.message)
		}
	}

	const updateLastMessage = async () => {
		socketId.emit("updateLastMessage", {
			lastMessage: newMessage,
			lastMessageId: seller._id,
		})

		await axios
			.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
				lastMessage: newMessage,
				lastMessageId: seller._id,
			})
			.then((res) => {
				setNewMessage("")
			})
			.catch((error) => console.log(error))
	}

	return (
		<div className=" w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
			{/* All messages list */}
			{!open && (
				<>
					<h1 className=" text-center text-[30px] py-5 font-Poppins">
						All Messages
					</h1>
					{conversations &&
						conversations.map((conversation, index) => (
							<MessageList
								conversation={conversation}
								key={conversation._id}
								index={index}
								setOpen={setOpen}
								setCurrentChat={setCurrentChat}
								me={seller?._id}
								setUserData={setUserData}
								online={onlineCheck(conversation)}
								setActiveStatus={setActiveStatus}
							/>
						))}
				</>
			)}

			{open ? (
				<SellerInbox
					setOpen={setOpen}
					newMessage={newMessage}
					setNewMessage={setNewMessage}
					sendMessageHandler={sendMessageHandler}
					messages={messages}
					seller={seller}
					userData={userData}
					activeStatus={activeStatus}
					scrollRef={scrollRef}
				/>
			) : null}
		</div>
	)
}

const MessageList = ({
	conversation,
	index,
	setOpen,
	setCurrentChat,
	me,
	setUserData,
	online,
	setActiveStatus,
}) => {
	const [active, setActive] = useState(0)
	const [user, setUser] = useState([])
	const navigate = useNavigate()

	const handleClick = (id) => {
		navigate("?" + id)
		setOpen(true)
	}

	useEffect(() => {
		setActiveStatus(online)
		const userId = conversation.members.find((m) => m !== me)

		const getUser = async () => {
			try {
				const res = await axios.get(`${server}/user/user-info/${userId}`)
				setUser(res.data.user)
			} catch (error) {
				console.log(error)
			}
		}

		getUser()
	}, [me, conversation])
	return (
		<div
			onClick={() =>
				setActive(index) ||
				handleClick(conversation._id) ||
				setCurrentChat(conversation) ||
				setUserData(user) ||
				setActiveStatus(online)
			}
			className={`w-full flex p-1 px-3 ${
				active === index ? "bg-[#18181815]" : "bg-transparent"
			}  cursor-pointer py-3`}>
			<div className="relative">
				<img
					src={`${backend_url}/${user?.avatar}`}
					alt=""
					className=" object-cover w-14 h-14 rounded-full"
				/>
				{online ? (
					<div className=" w-3 h-3 bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
				) : (
					<div className=" w-3 h-3 bg-[#00000057] rounded-full absolute top-[2px] right-[2px]" />
				)}
			</div>
			<div className="pl-3">
				<h1 className=" text-lg">{user?.name}</h1>
				<p className=" text-[16px] text-[#000c]">
					{" "}
					{conversation.lastMessageId !== user?._id
						? "You:"
						: user?.name.split(" ")[0]}{" "}
					{conversation.lastMessage}
				</p>
			</div>
		</div>
	)
}

const SellerInbox = ({
	setOpen,
	newMessage,
	setNewMessage,
	sendMessageHandler,
	messages,
	seller,
	userData,
	activeStatus,
	scrollRef,
}) => {
	return (
		<div className="w-full min-h-full flex-col justify-between flex">
			{/* message header */}
			<div className="w-full flex p-3 bg-slate-200 justify-between items-center">
				<div className="flex">
					<img
						src={`${backend_url}/${userData.avatar}`}
						alt=""
						className=" w-16 h-16 rounded-full object-cover"
					/>

					<div className="pl-3">
						<h1 className=" text-lg font-[600]">{userData.name}</h1>
						{activeStatus && <h1>Active now</h1>}
					</div>
				</div>
				<AiOutlineArrowRight
					className=" cursor-pointer"
					size={30}
					onClick={() => setOpen(false)}
				/>
			</div>
			{/* messages */}
			<div className="px-3 h-[65vh] py-3 overflow-y-scroll">
				{messages &&
					messages.map((item, index) => (
						<div
							key={index}
							className={`flex w-full my-2 ${
								item.sender === seller._id ? " justify-end" : " justify-start"
							}`}
							ref={scrollRef}>
							{item.sender !== seller._id && (
								<img
									src={`${backend_url}/${userData.avatar}`}
									alt=""
									className="rounded-full h-[40px] w-[40px] mr-3"
								/>
							)}
							<div className="">
								<div
									className={`w-max rounded ${
										item.sender === seller._id
											? " bg-slate-700"
											: "bg-[#38c776]"
									} p-3 text-white h-min`}>
									<p>{item.text}</p>
								</div>

								<p className="text-[12px] text-[#000000b5] pt-1">
									{format(item.createdAt)}
								</p>
							</div>
						</div>
					))}
			</div>
			{/* send message input */}
			<form
				aria-required={true}
				className="p-3 relative w-full flex justify-between items-center"
				onSubmit={sendMessageHandler}>
				<div className="w-[30px]">
					<TfiGallery className="cursor-pointer" size={20} />
				</div>
				<div className="w-full">
					<input
						type="text"
						required
						placeholder="Enter your message..."
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						className={`${styles.input}`}
					/>
					<input type="submit" value="Send" className="hidden" id="send" />
					<label htmlFor="send">
						<AiOutlineSend
							size={20}
							className="absolute right-4 top-5 cursor-pointer"
						/>
					</label>
				</div>
			</form>
		</div>
	)
}

export default DashboardMessages
