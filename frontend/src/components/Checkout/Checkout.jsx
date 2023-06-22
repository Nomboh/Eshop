import React, { useEffect, useState } from "react"
import styles from "../../styles/styles"
import { Country, State } from "country-state-city"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"
import { server } from "../../server"

const Checkout = () => {
	const navigate = useNavigate()
	const [address1, setAddress1] = useState("")
	const [address2, setAddress2] = useState("")
	const [city, setCity] = useState("")
	const [country, setCountry] = useState("")
	const [zipCode, setZipCode] = useState(undefined)
	const [userInfo, setUserInfo] = useState(false)
	const [couponCode, setCouponCode] = useState("")
	const [couponCodeData, setCouponCodeData] = useState(null)
	const [couponValue, setCouponValue] = useState(0)

	const { user } = useSelector((state) => state.user)
	const { cart } = useSelector((cart) => cart.cart)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const name = couponCode
			const res = await axios.get(`${server}/coupon/get-couponCode/${name}`)

			const shopId = res.data.couponCode?.shopId
			const couponValue = res.data.couponCode?.value

			if (res.data.couponCode === null) {
				toast.error("We could not verify you coupon code")
				setCouponCode("")
			} else {
				const shopEligibleForCoupon =
					cart && cart.filter((item) => item.shopId === shopId)
				if (shopEligibleForCoupon.length > 0) {
					const eligibleValue = shopEligibleForCoupon.reduce(
						(acc, cart) => acc + cart.qty * cart.discountPrice,
						0
					)
					setCouponValue((eligibleValue * couponValue) / 100)
					setCouponCodeData(res.data.couponCode)
					setCouponCode("")
				} else {
					toast.error("There is no coupon assign for this item")
					setCouponCode("")
				}
			}
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message)
		}
	}

	const subTotalPrice = cart.reduce(
		(acc, item) => acc + item.qty * item.discountPrice,
		0
	)

	const discountPercentage = couponValue

	// shipping const change later if you like
	const shipping = (subTotalPrice * 0.1).toFixed(2) * 1

	const totalPrice =
		(subTotalPrice + shipping - discountPercentage).toFixed(2) * 1

	const paymentSubmit = () => {
		if (
			zipCode === "" ||
			country === "" ||
			city === "" ||
			address1 === "" ||
			address2 === ""
		) {
			toast.error("please fill out your shipping info before proceeding")
		} else {
			const shippingAddress = {
				address1,
				address2,
				city,
				country,
				zipCode,
			}

			const checkoutData = {
				shippingAddress,
				totalPrice,
				subTotalPrice,
				cart,
				user,
				shipping,
				discountPercentage,
			}

			localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
			navigate("/payment")
		}
	}

	return (
		<div className="w-full flex flex-col items-center py-8">
			<div className="w-[90%] 1000px:w-[70%] block 800px:flex">
				<div className="w-full 800px:w-[65%]">
					<ShippingInfo
						user={user}
						address1={address1}
						address2={address2}
						city={city}
						country={country}
						zipCode={zipCode}
						setAddress1={setAddress1}
						setAddress2={setAddress2}
						setCity={setCity}
						setZipCode={setZipCode}
						setCountry={setCountry}
						userInfo={userInfo}
						setUserInfo={setUserInfo}
					/>
				</div>
				<div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
					<CartData
						handleSubmit={handleSubmit}
						totalPrice={totalPrice}
						shipping={shipping}
						subTotalPrice={subTotalPrice}
						couponCode={couponCode}
						setCouponCode={setCouponCode}
						discountPercentage={discountPercentage}
					/>
				</div>
			</div>
			<div
				className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
				onClick={paymentSubmit}>
				<h5 className="text-white">Go to Payment</h5>
			</div>
		</div>
	)
}

const ShippingInfo = ({
	user,
	address1,
	address2,
	city,
	country,
	zipCode,
	setAddress1,
	setAddress2,
	setCity,
	setZipCode,
	setCountry,
	userInfo,
	setUserInfo,
}) => {
	return (
		<div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
			<h5 className="text-[18px] font-[500]">Shipping Address</h5>
			<br />
			<form>
				<div className="w-full flex pb-3">
					<div className="w-[50%]">
						<label className="block pb-2">Full Name</label>
						<input
							type="text"
							required
							value={user && user.name}
							className={`${styles.input} !w-[95%]`}
						/>
					</div>
					<div className="w-[50%]">
						<label className="block pb-2">Email Address</label>
						<input
							type="email"
							value={user && user.email}
							required
							className={`${styles.input}`}
						/>
					</div>
				</div>

				<div className="w-full flex pb-3">
					<div className="w-[50%]">
						<label className="block pb-2">Phone Number</label>
						<input
							type="number"
							required
							value={user && user.phoneNumber}
							className={`${styles.input} !w-[95%]`}
						/>
					</div>
					<div className="w-[50%]">
						<label className="block pb-2">Zip Code</label>
						<input
							type="number"
							value={zipCode}
							onClick={(e) => setZipCode(e.target.value)}
							required
							className={`${styles.input}`}
						/>
					</div>
				</div>

				<div className="w-full flex pb-3">
					<div className="w-[50%]">
						<label className="block pb-2">Country</label>
						<select
							className="w-[95%] border h-[40px] rounded-[5px]"
							value={country}
							onChange={(e) => setCountry(e.target.value)}>
							<option className="block pb-2" value="">
								Choose your country
							</option>
							{Country &&
								Country.getAllCountries().map((item) => (
									<option key={item.isoCode} value={item.isoCode}>
										{item.name}
									</option>
								))}
						</select>
					</div>
					<div className="w-[50%]">
						<label className="block pb-2">City</label>
						<select
							className="w-[95%] border h-[40px] rounded-[5px]"
							onChange={(e) => e.target.value}
							value={city}>
							<option className="block pb-2" value="">
								Choose your City
							</option>
							{State &&
								State.getStatesOfCountry(country).map((item) => (
									<option key={item.isoCode} value={item.isoCode}>
										{item.name}
									</option>
								))}
						</select>
					</div>
				</div>

				<div className="w-full flex pb-3">
					<div className="w-[50%]">
						<label className="block pb-2">Address1</label>
						<input
							type="address"
							required
							value={address1}
							onClick={(e) => setAddress1(e.target.value)}
							className={`${styles.input} !w-[95%]`}
						/>
					</div>
					<div className="w-[50%]">
						<label className="block pb-2">Address2</label>
						<input
							type="address"
							value={address2}
							onClick={(e) => setAddress2(e.target.value)}
							required
							className={`${styles.input}`}
						/>
					</div>
				</div>

				<div></div>
			</form>
			<h5
				className=" text-[18px] cursor-pointer"
				onClick={() => setUserInfo(!userInfo)}>
				Choose from save addresses
			</h5>
			{userInfo && (
				<div className="">
					{user &&
						user.address.map((address, index) => (
							<div key={index} className=" w-full flex mt-1">
								<input
									type="checkbox"
									name=""
									onClick={() =>
										setAddress1(address.address1) ||
										setAddress2(address.address2) ||
										setCity(address.city) ||
										setZipCode(address.zipCode) ||
										setCountry(address.country)
									}
									id=""
								/>
								<h2 className=" ml-3">{address.addressType}</h2>
							</div>
						))}
				</div>
			)}
		</div>
	)
}

const CartData = ({
	handleSubmit,
	totalPrice,
	shipping,
	subTotalPrice,
	couponCode,
	setCouponCode,
	discountPercentage,
}) => {
	return (
		<div className="w-full bg-[#fff] rounded-md p-5 pb-8">
			<div className="flex justify-between">
				<h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
				<h5 className="text-[18px] font-[600]">${subTotalPrice}</h5>
			</div>
			<br />
			<div className="flex justify-between">
				<h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
				<h5 className="text-[18px] font-[600]">${shipping}</h5>
			</div>
			<br />
			<div className="flex justify-between border-b pb-3">
				<h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
				<h5 className="text-[18px] font-[600]">
					{discountPercentage ? "- $" + discountPercentage : "-"}
				</h5>
			</div>
			<h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
			<br />
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					className={`${styles.input} h-[40px] pl-2`}
					placeholder="Coupoun code"
					value={couponCode}
					required
					onChange={(e) => setCouponCode(e.target.value)}
				/>
				<input
					className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
					required
					value="Apply code"
					type="submit"
				/>
			</form>
		</div>
	)
}

export default Checkout
