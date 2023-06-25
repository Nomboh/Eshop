const express = require("express")
const path = require("path")
const User = require("../model/user")
const router = express.Router()
const { upload } = require("../multer")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/sendMail")
const sendToken = require("../utils/jwtToken")
const { isAuthenticated, isAdmin } = require("../middleware/auth")
const user = require("../model/user")

router.post("/create-user", upload.single("file"), async (req, res, next) => {
	try {
		const { name, email, password } = req.body
		const userEmail = await User.findOne({ email })

		if (userEmail) {
			const filename = req.file.filename
			const filePath = `uploads/${filename}`
			fs.unlink(filePath, (err) => {
				if (err) {
					console.log(err)
					res.status(500).json({ message: "Error deleting file" })
				}
			})
			return next(new ErrorHandler("User already exists", 400))
		}

		const filename = req.file.filename
		const fileUrl = path.join(filename)

		const user = {
			name: name,
			email: email,
			password: password,
			avatar: fileUrl,
		}

		const activationToken = createActivationToken(user)

		const activationUrl = `https://eshop-4vtd.vercel.app/activation/${activationToken}`

		try {
			await sendMail({
				email: user.email,
				subject: "Activate your account",
				message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
			})
			res.status(201).json({
				success: true,
				message: `please check your email:- ${user.email} to activate your account!`,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	} catch (error) {
		return next(new ErrorHandler(error.message, 400))
	}
})

// create activation token
const createActivationToken = (user) => {
	return jwt.sign(user, process.env.ACTIVATION_SECRET, {
		expiresIn: "5m",
	})
}

// activate user
router.post(
	"/activation",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { activation_token } = req.body

			const newUser = jwt.verify(
				activation_token,
				process.env.ACTIVATION_SECRET
			)

			if (!newUser) {
				return next(new ErrorHandler("Invalid token", 400))
			}
			const { name, email, password, avatar } = newUser

			let user = await User.findOne({ email })

			if (user) {
				return next(new ErrorHandler("User already exists", 400))
			}
			user = await User.create({
				name,
				email,
				avatar,
				password,
			})

			sendToken(user, 201, res)
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// login user
router.post(
	"/login-user",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { email, password } = req.body

			if (!email || !password) {
				return next(new ErrorHandler("Please provide the all fields!", 400))
			}

			const user = await User.findOne({ email }).select("+password")

			if (!user) {
				return next(new ErrorHandler("User doesn't exists!", 400))
			}

			const isPasswordValid = await user.comparePassword(password)

			if (!isPasswordValid) {
				return next(
					new ErrorHandler("Please provide the correct information", 400)
				)
			}

			sendToken(user, 201, res)
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// load user
router.get(
	"/getuser",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const user = await User.findById(req.user.id)

			if (!user) {
				return next(new ErrorHandler("User doesn't exists", 400))
			}

			res.status(200).json({
				success: true,
				user,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// Logout User
router.get(
	"/logout",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			res.cookie("token", null, {
				expires: new Date(Date.now()),
				httpOnly: true,
			})

			res.status(200).json({
				success: true,
				message: "User logged out successfully",
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// update user info
router.put(
	"/update-user-info",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { password, email, name, phoneNumber } = req.body

			const dbUser = await User.findById(req.user).select("+password")

			console.log(dbUser)

			if (!dbUser)
				return next(new ErrorHandler("Please Login to update info", 400))

			const isPasswordCorrect = await dbUser.comparePassword(password)

			if (!isPasswordCorrect)
				return next(new ErrorHandler("Wrong Password. Please try again", 400))

			dbUser.name = name
			dbUser.email = email
			dbUser.phoneNumber = phoneNumber

			await dbUser.save()

			res.status(200).json({
				success: true,
				user: dbUser,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// update user avater
router.put(
	"/update-avatar",
	isAuthenticated,
	upload.single("image"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const existingUser = await User.findById(req.user.id)
			const existingPath = `uploads/${existingUser.avatar}`

			if (fs.existsSync(existingPath)) {
				fs.unlinkSync(existingPath)
			}

			const fileUrl = path.join(req.file.filename)

			const user = await User.findByIdAndUpdate(req.user.id, {
				avatar: fileUrl,
			})

			res.status(200).json({
				success: true,
				user,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// Update user address
router.put(
	"/update-user-address",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const user = await User.findById(req.user.id)
			const sameTypeAddress = user.address.find(
				(addres) => addres.addressType === req.body.addressType
			)

			if (sameTypeAddress) {
				return next(
					new ErrorHandler(
						`${req.body.addressType} address already exists`,
						400
					)
				)
			}

			const existAddress = user.address.find(
				(addres) => addres._id === req.body._id
			)

			if (existAddress) {
				Object.assign(existAddress, req.body)
			} else {
				user.address.push(req.body)
			}

			await user.save()

			res.status(200).json({
				success: true,
				user,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// Update user address
router.delete(
	"/delete-user-address/:id",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const userId = req.user.id
			const addressId = req.params.id

			await User.updateOne(
				{ _id: userId },
				{
					$pull: {
						address: {
							_id: addressId,
						},
					},
				}
			)

			const user = await User.findById(userId)

			res.status(200).json({
				success: true,
				user,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// Update user address
router.put(
	"/update-user-password",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { newPassword, oldPassword, confirmPassword } = req.body

			// find user base on current login user

			const user = await User.findById(req.user.id).select("+password")
			const comparePassword = await user.comparePassword(oldPassword)

			if (!comparePassword) {
				return next(
					new ErrorHandler("Your old password is not correct, try again!", 400)
				)
			}

			if (newPassword !== confirmPassword) {
				return next(
					new ErrorHandler("Your passwords do not match, try again!", 400)
				)
			}

			user.password = newPassword

			await user.save()

			res.status(200).json({
				success: true,
				message: "Password successfully changed",
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// find user information with user ID

router.get(
	"/user-info/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const user = await User.findById(req.params.id)

			if (!user) {
				return next(new ErrorHandler("User doesn't exists", 400))
			}

			res.status(200).json({
				success: true,
				user,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// all users --- for admin
router.get(
	"/admin-all-users",
	isAuthenticated,
	isAdmin("Admin"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const users = await User.find().sort({
				createdAt: -1,
			})
			res.status(201).json({
				success: true,
				users,
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

// delete users --- admin
router.delete(
	"/delete-user/:id",
	isAuthenticated,
	isAdmin("Admin"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const user = await User.findById(req.params.id)

			if (!user) {
				return next(new ErrorHandler("User is not available with this id", 400))
			}

			await User.findByIdAndDelete(req.params.id)

			res.status(201).json({
				success: true,
				message: "User deleted successfully!",
			})
		} catch (error) {
			return next(new ErrorHandler(error.message, 500))
		}
	})
)

module.exports = router
