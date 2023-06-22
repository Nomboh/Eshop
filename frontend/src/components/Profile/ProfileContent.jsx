import React, { useEffect, useState } from "react"
import { AiOutlineCamera } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { backend_url, server } from "../../server"
import styles from "../../styles/styles"
import AllOrders from "./AllOrders"
import AllRefundOrders from "./AllRefundOrders"
import TrackOrder from "./TrackOrder"
import ChangePassword from "./ChangePassword"
import Address from "./Address.jsx"
import { loadUser, updateUserInformation } from "../../redux/actions/user"
import { toast } from "react-toastify"
import axios from "axios"

const ProfileContent = ({ active }) => {
	const { user, error, successMessage } = useSelector((state) => state.user)
	const [name, setName] = useState(user && user.name)
	const [email, setEmail] = useState(user && user.email)
	const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber)
	const [password, setPassword] = useState("")
	const [avatar, setAvatar] = useState()

	const dispatch = useDispatch()

	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch(updateUserInformation({ email, password, phoneNumber, name }))
	}

	useEffect(() => {
		if (error) {
			toast.error(error)
			dispatch({ type: "clearErrors" })
		}

		// add success message
		if (successMessage) {
			toast.success(successMessage)
			dispatch({ type: "clearSuccessMessage" })
		}
	}, [error, successMessage, dispatch])

	const handleFile = async (e) => {
		const file = e.target.files[0]
		setAvatar(file)

		const formData = new FormData()

		formData.append("image", e.target.files[0])

		await axios
			.put(`${server}/user/update-avatar`, formData, {
				withCredentials: true,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(() => {
				dispatch(loadUser())
				toast.success("Avater updated sucessfully")
			})
			.catch((error) => {
				toast.error(error.response.data.message)
			})
	}

	return (
		<div className="w-full">
			{/* profile */}
			{active === 1 && (
				<>
					<div className="flex justify-center w-full">
						<div className="relative">
							<img
								src={`${backend_url}${user?.avatar}`}
								className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
								alt=""
							/>
							<div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
								<input
									type="file"
									name="avatar"
									id="image"
									onChange={handleFile}
									className=" hidden"
								/>
								<label htmlFor="image">
									<AiOutlineCamera />
								</label>
							</div>
						</div>
					</div>
					<br />
					<br />
					<div className="w-full px-5">
						<form onSubmit={handleSubmit} aria-required={true}>
							<div className="w-full 800px:flex block pb-3">
								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Full Name</label>
									<input
										type="text"
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Email Address</label>
									<input
										type="text"
										className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>

							<div className="w-full 800px:flex block pb-3">
								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Phone Number</label>
									<input
										type="number"
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
									/>
								</div>

								<div className=" w-[100%] 800px:w-[50%]">
									<label className="block pb-2">Password</label>
									<input
										type="password"
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
							</div>

							<input
								className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
								required
								value="Update"
								type="submit"
							/>
						</form>
					</div>
				</>
			)}

			{/* order */}
			{active === 2 && (
				<div>
					<AllOrders />
				</div>
			)}

			{/* Refund */}
			{active === 3 && (
				<div>
					<AllRefundOrders />
				</div>
			)}

			{/* Track order */}
			{active === 5 && (
				<div>
					<TrackOrder />
				</div>
			)}

			{/* Track order */}
			{active === 6 && (
				<div>
					<ChangePassword />
				</div>
			)}

			{/*  user Address */}
			{active === 7 && (
				<div>
					<Address />
				</div>
			)}
		</div>
	)
}

export default ProfileContent
