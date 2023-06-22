import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../../styles/styles"
import axios from "axios"
import { RxCross1 } from "react-icons/rx"
import {
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js"

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { server } from "../../server"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

const Payment = () => {
	const { user } = useSelector((state) => state.user)
	const [checkoutData, setCheckoutData] = useState(null)
	const [open, setOpen] = useState(false)
	const stripe = useStripe()
	const element = useElements()
	const navigate = useNavigate()
	useEffect(() => {
		setCheckoutData(JSON.parse(localStorage.getItem("checkoutData")))
	}, [])

	const createOrder = (data, actions) => {
		return actions.order
			.create({
				purchase_units: [
					{
						description: "Sun Flower",
						amount: {
							currency_code: "USD",
							value: checkoutData?.totalPrice,
						},
					},
				],
				application_context: {
					shipping_preference: "NO_SHIPPING",
				},
			})
			.then((orderId) => {
				return orderId
			})
	}

	const onApprove = async (data, action) => {
		return action.order.capture().then(function (details) {
			const { payer } = details

			let paymentInfo = payer

			if (paymentInfo !== undefined) {
				paypalPaymentHandler(paymentInfo)
			}
		})
	}

	const paymentData = {
		amount: Math.round(checkoutData?.totalPrice * 100),
	}

	const orderItems = {
		cart: checkoutData?.cart,
		shippingAddress: checkoutData?.shippingAddress,
		user,
		totalPrice: checkoutData?.totalPrice,
	}

	const paymentHandler = async (e) => {
		e.preventDefault()

		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			}

			const { data } = await axios.post(
				`${server}/payment/process`,
				paymentData,
				config
			)

			const clientSecret = data.client_secret

			if (!stripe || !element) return

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: element.getElement(CardNumberElement),
				},
			})

			if (result.error) {
				toast.error(result.error.message)
			} else {
				if (result.paymentIntent.status === "succeeded") {
					orderItems.paymentInfo = {
						id: result.paymentIntent.id,
						status: result.paymentIntent.status,
						type: "Credit Card",
					}

					await axios
						.post(`${server}/order/create-order`, orderItems, config)
						.then((res) => {
							setOpen(false)
							navigate("/order/success")
							toast.success("Order successfully created")

							localStorage.setItem("cartItems", JSON.stringify([]))
							localStorage.setItem("checkoutData", JSON.stringify([]))
							window.location.reload()
						})
						.catch((error) => toast.error(error.response.data.message))
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const paypalPaymentHandler = async (paymentInfo) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		}

		orderItems.paymentInfo = {
			id: paymentInfo.payer_id,
			status: "success",
			type: "Paypal",
		}

		await axios
			.post(`${server}/order/create-order`, orderItems, config)
			.then((res) => {
				setOpen(false)
				navigate("/order/success")
				toast.success("Order successfully created")
				window.location.reload()

				localStorage.setItem("cartItems", JSON.stringify([]))
				localStorage.setItem("checkoutData", JSON.stringify([]))
			})
			.catch((error) => toast.error(error.response.data.message))
	}

	const cashOnDelivery = async (e) => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			}

			orderItems.paymentInfo = {
				type: "Cash on delivery",
			}

			const { data } = await axios.post(
				`${server}/order/create-order`,
				orderItems,
				config
			)

			if (data.success) {
				setOpen(false)
				navigate("/order/success")
				toast.success("Order successfully created")
				window.location.reload()

				localStorage.setItem("cartItems", JSON.stringify([]))
				localStorage.setItem("checkoutData", JSON.stringify([]))
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	return (
		<div className="w-full flex flex-col items-center py-8">
			<div className="w-[90%] 1000px:w-[70%] block 800px:flex">
				<div className="w-full 800px:w-[65%]">
					<PaymentInfo
						user={user}
						open={open}
						setOpen={setOpen}
						onApprove={onApprove}
						createOrder={createOrder}
						paymentHandler={paymentHandler}
						cashOnDelivery={cashOnDelivery}
					/>
				</div>
				<div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
					<CartData
						totalPrice={checkoutData?.totalPrice}
						subTotalPrice={checkoutData?.subTotalPrice}
						shipping={checkoutData?.shipping}
						discountPercentage={checkoutData?.discountPercentage}
					/>
				</div>
			</div>
		</div>
	)
}

const PaymentInfo = ({
	user,
	open,
	setOpen,
	onApprove,
	createOrder,
	paymentHandler,
	cashOnDelivery,
}) => {
	const [select, setSelect] = useState(1)

	return (
		<div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
			{/* select buttons */}
			<div>
				<div className="flex w-full pb-5 border-b mb-2">
					<div
						className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
						onClick={() => setSelect(1)}>
						{select === 1 ? (
							<div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
						) : null}
					</div>
					<h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
						Pay with Debit/credit card
					</h4>
				</div>

				{/* pay with card */}
				{select === 1 ? (
					<div className="w-full flex border-b">
						<form className="w-full" onSubmit={paymentHandler}>
							<div className="w-full flex pb-3">
								<div className="w-[50%]">
									<label className="block pb-2">Name on card</label>
									<input
										required
										placeholder={user && user.name}
										className={`${styles.input} !w-[95%] text-[#444]`}
										value={user && user.name}
									/>
								</div>
								<div className="w-[50%]">
									<label className="block pb-2">Exp Date</label>
									<CardExpiryElement
										className={`${styles.input}`}
										options={{
											style: {
												base: {
													fontSize: "19px",
													lineHeight: 1.5,
													color: "#444",
												},
												empty: {
													color: "#3a120a",
													backgroundColor: "transparent",
													"::placeholder": {
														color: "#444",
													},
												},
											},
										}}
									/>
								</div>
							</div>

							<div className="w-full flex pb-3">
								<div className="w-[50%]">
									<label className="block pb-2">Card Number</label>
									<CardNumberElement
										className={`${styles.input} !h-[35px] !w-[95%]`}
										options={{
											style: {
												base: {
													fontSize: "19px",
													lineHeight: 1.5,
													color: "#444",
												},
												empty: {
													color: "#3a120a",
													backgroundColor: "transparent",
													"::placeholder": {
														color: "#444",
													},
												},
											},
										}}
									/>
								</div>
								<div className="w-[50%]">
									<label className="block pb-2">Card Number</label>
									<CardCvcElement
										className={`${styles.input} !h-[35px]`}
										options={{
											style: {
												base: {
													fontSize: "19px",
													lineHeight: 1.5,
													color: "#444",
												},
												empty: {
													color: "#3a120a",
													backgroundColor: "transparent",
													"::placeholder": {
														color: "#444",
													},
												},
											},
										}}
									/>
								</div>
							</div>
							<input
								type="submit"
								value="Submit"
								className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
							/>
						</form>
					</div>
				) : null}
			</div>

			<br />
			{/* paypal payment */}
			<div>
				<div className="flex w-full pb-5 border-b mb-2">
					<div
						className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
						onClick={() => setSelect(2)}>
						{select === 2 ? (
							<div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
						) : null}
					</div>
					<h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
						Pay with Paypal
					</h4>
				</div>

				{/* pay with card */}
				{select === 2 ? (
					<div className="w-full flex border-b">
						<form className="w-full" onSubmit={paymentHandler}>
							<div
								onClick={() => setOpen(true)}
								className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}>
								Pay Now
							</div>
							{open && (
								<div className="w-full fixed top-0 left-0 bg-[#00000064] h-screen flex items-center justify-center z-[9999]">
									<div className=" w-full 800px:w-[40%] h-screen 800px:h-[80%] bg-white rounded-[5px] shodow flex flex-col justify-center p-8 relative overflow-y-scroll ">
										<div className="w-full flex justify-end p-3">
											<RxCross1
												size={30}
												className=" cursor-pointer absolute top-3 right-3 "
												onClick={() => setOpen(false)}
											/>
										</div>
										<PayPalScriptProvider
											options={{
												clientId:
													"Adcrth6Qx3HolalXbQl-6_GYK5LY_Y_RHVLg1Qw_GxNlHzHF7HgcZiQZSK7C3O3qVgRccU1-O1OWSygE",
											}}>
											<PayPalButtons
												style={{
													layout: "vertical",
												}}
												onApprove={onApprove}
												createOrder={createOrder}
											/>
										</PayPalScriptProvider>
									</div>
								</div>
							)}
						</form>
					</div>
				) : null}
			</div>

			<br />
			{/* cash on delivery */}
			<div>
				<div className="flex w-full pb-5 border-b mb-2">
					<div
						className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
						onClick={() => setSelect(3)}>
						{select === 3 ? (
							<div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
						) : null}
					</div>
					<h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
						Cash on Delivery
					</h4>
				</div>

				{/* Cash on delivery*/}
				{select === 3 ? (
					<div className="w-full flex">
						<form className="w-full" onSubmit={cashOnDelivery}>
							<input
								type="submit"
								value="Confirm"
								className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
							/>
						</form>
					</div>
				) : null}
			</div>
		</div>
	)
}
const CartData = ({
	totalPrice,
	subTotalPrice,
	shipping,
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
				<h5 className="text-[18px] font-[600]">{shipping}</h5>
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
			{/* <form>
				<input
					type="text"
					className={`${styles.input} h-[40px] pl-2`}
					placeholder="Coupoun code"
					required
				/>
				<input
					className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
					required
					value="Apply code"
					type="submit"
				/>
			</form> */}
		</div>
	)
}

export default Payment
