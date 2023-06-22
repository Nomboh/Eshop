import { AiOutlineDelete } from "react-icons/ai"
import styles from "../../styles/styles"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { RxCross1 } from "react-icons/rx"
import { Country, State } from "country-state-city"
import { deleteUserAddress, updateUserAddress } from "../../redux/actions/user"

const Address = () => {
	const [open, setOpen] = useState(false)
	const [country, setCountry] = useState("")
	const [city, setCity] = useState("")
	const [zipCode, setZipCode] = useState("")
	const [address1, setAddress1] = useState("")
	const [address2, setAddress2] = useState("")
	const [addressType, setAddressType] = useState("")
	const { user } = useSelector((state) => state.user)

	const dispatch = useDispatch()

	const addressTypeData = [
		{ name: "Default" },
		{
			name: "Home",
		},
		{
			name: "Office",
		},
	]

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (addressType === "" || country === "" || city === "") {
			toast.error("Please Provide all fields!")
		} else {
			dispatch(
				updateUserAddress({
					country,
					city,
					zipCode,
					address1,
					address2,
					addressType,
				})
			)

			setOpen(false)
			setCountry("")
			setCity("")
			setAddress1("")
			setZipCode(undefined)
			setAddressType("")
			setAddress2("")
		}
	}

	const handleDeleteAddress = (id) => {
		dispatch(deleteUserAddress(id))
	}

	return (
		<div className="w-full px-5">
			{open && (
				<div className=" w-full h-screen fixed flex items-center justify-center top-0 left-0 bg-[#0000006c]">
					<div className=" w-[40%] h-[80vh] overflow-y-scroll bg-white relative">
						<div
							className="w-full flex justify-end p-3"
							onClick={() => setOpen(false)}>
							<RxCross1 className=" cursor-pionter" size={35} />
						</div>
						<h1 className=" text-center text-[25px] font-Poppins">
							Add New Address
						</h1>
						<form aria-required onSubmit={handleSubmit}>
							<div className="w-full block p-4">
								<div className="w-full pb-2">
									<label htmlFor="country" className=" block pb-2">
										Country
									</label>

									<select
										className=" w-[95%] h-[40px] border rounded-sm"
										name="country"
										id="country"
										value={country}
										onChange={(e) => setCountry(e.target.value)}>
										<option value="" className=" w-full block pb-2">
											Choose Your Country
										</option>
										{Country &&
											Country.getAllCountries().map((x) => (
												<option
													className=" block pb-2"
													key={x.name}
													value={x.isoCode}>
													{x.name}
												</option>
											))}
									</select>
								</div>

								<div className="w-full pb-2">
									<label htmlFor="country" className=" block pb-2">
										City
									</label>

									<select
										className=" w-[95%] h-[40px] border rounded-sm"
										name="country"
										id="country"
										value={city}
										onChange={(e) => setCity(e.target.value)}>
										<option value="" className=" w-full block pb-2">
											Choose Your City
										</option>
										{State &&
											State.getStatesOfCountry(country).map((x) => (
												<option
													className=" block pb-2"
													key={x.isoCode}
													value={x.isoCode}>
													{x.name}
												</option>
											))}
									</select>
								</div>

								<div className="w-full pb-2">
									<label htmlFor="country" className=" block pb-2">
										Address 1
									</label>

									<input
										type="address"
										className={`${styles.input}`}
										required
										value={address1}
										onChange={(e) => setAddress1(e.target.value)}
									/>
								</div>

								<div className="w-full pb-2">
									<label htmlFor="country" className=" block pb-2">
										Address 2
									</label>

									<input
										type="address"
										className={`${styles.input}`}
										required
										value={address2}
										onChange={(e) => setAddress2(e.target.value)}
									/>
								</div>

								<div className="w-full pb-2">
									<label htmlFor="country" className=" block pb-2">
										Zip Code
									</label>

									<input
										type="zipCode"
										className={`${styles.input}`}
										required
										value={zipCode}
										onChange={(e) => setZipCode(e.target.value)}
									/>
								</div>

								<div className="w-full pb-2">
									<label htmlFor="country" className=" block pb-2">
										Address Type
									</label>

									<select
										className=" w-[95%] h-[40px] border rounded-sm"
										name="addressType"
										id="address_type"
										value={country}
										onChange={(e) => setAddressType(e.target.value)}>
										<option value="" className=" w-full block pb-2">
											Choose Your Address Type
										</option>
										{addressTypeData &&
											addressTypeData.map((x) => (
												<option
													className=" block pb-2"
													key={x.name}
													value={x.name}>
													{x.name}
												</option>
											))}
									</select>
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
			)}
			<div className="flex w-full items-center justify-between">
				<h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
					My Address
				</h1>
				<div
					className={`${styles.button} !rounded-md`}
					onClick={() => setOpen(true)}>
					<span className="text-[#fff]">Add New</span>
				</div>
			</div>
			<br />
			{user &&
				user.address.map((item, index) => (
					<div
						key={index}
						className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
						<div className="flex items-center">
							<h5 className="pl-5 font-[600]">{item.addressType}</h5>
						</div>
						<div className="pl-8 flex items-center">
							<h6 className="text-[12px] 800px:text-[unset]">
								{item.city}, {item?.address1}, {item?.address2}
							</h6>
						</div>
						<div className="pl-8 flex items-center">
							<h6 className="text-[12px] 800px:text-[unset]">
								{user.phoneNumber}
							</h6>
						</div>
						<div
							className="min-w-[10%] flex items-center justify-between pl-8"
							onClick={() => handleDeleteAddress(item._id)}>
							<AiOutlineDelete size={25} className="cursor-pointer" />
						</div>
					</div>
				))}

			{user.address.length === 0 && (
				<div className="w-full mt-8 ">
					<h1 className=" text-2xl text-center">You have no Save address</h1>
					<h1 className=" text-2xl text-center mt-5">
						Click the "add address" button above to add a new address
					</h1>
				</div>
			)}
		</div>
	)
}

export default Address
