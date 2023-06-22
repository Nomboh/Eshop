import { AiOutlineDelete } from "react-icons/ai"
import styles from "../../styles/styles"
import { useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { server } from "../../server"

const ChangePassword = () => {
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const { data } = await axios.put(
				`${server}/user/update-user-password`,
				{ oldPassword, newPassword, confirmPassword },
				{ withCredentials: true }
			)

			if (data.success) {
				toast.success(data.message)
				setConfirmPassword("")
				setOldPassword("")
				setNewPassword("")
			}
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message)
		}
	}
	return (
		<div className="w-full px-5">
			<div className="flex w-full items-center justify-center">
				<h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
					Change Password
				</h1>
			</div>
			<br />
			<div className="w-full flex items-center justify-center">
				<div className="w-[50%] bg-white rounded-md">
					<form aria-required onSubmit={handleSubmit}>
						<div className="w-full block p-4">
							<div className="w-full pb-2">
								<label htmlFor="country" className=" block pb-2">
									Old Password
								</label>

								<input
									type="password"
									className={`${styles.input}`}
									required
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
								/>
							</div>

							<div className="w-full pb-2">
								<label htmlFor="country" className=" block pb-2">
									New Password
								</label>

								<input
									type="password"
									className={`${styles.input}`}
									required
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</div>

							<div className="w-full pb-2">
								<label htmlFor="country" className=" block pb-2">
									Confirm Password
								</label>

								<input
									type="password"
									className={`${styles.input}`}
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</div>

							<div className="w-full pb-2">
								<input
									type="submit"
									value="Submit"
									required
									readOnly
									className={`${styles.input} mt-5 cursor-pointer border-[blue]`}
								/>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
export default ChangePassword
