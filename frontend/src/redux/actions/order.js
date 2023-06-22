import axios from "axios"
import { server } from "../../server"

// get all order
export const getAllOrders = (userId) => async (dispatch) => {
	try {
		dispatch({
			type: "getAllOrdersRequest",
		})

		const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`)

		dispatch({
			type: "getAllOrdersSuccess",
			payload: data.orders,
		})
	} catch (error) {
		dispatch({
			type: "getAllOrdersFailed",
			payload: error.response.data.message,
		})
	}
}

// get all order
export const getAllShopOrders = (shopId) => async (dispatch) => {
	try {
		dispatch({
			type: "getAllShopOrdersRequest",
		})

		const { data } = await axios.get(
			`${server}/order/get-seller-all-orders/${shopId}`
		)

		const orderData = data.orders.filter(
			(order) => order.status === "Delivered"
		)

		const totalEarnings = orderData.reduce(
			(acc, item) => acc + item.totalPrice,
			0
		)
		const serviceCharge = totalEarnings * 0.1
		const availableBalance = (totalEarnings - serviceCharge).toFixed(2)

		dispatch({
			type: "getAllShopOrdersSuccess",
			payload: {
				shopOrders: data.orders,
				availableBalance,
			},
		})
	} catch (error) {
		dispatch({
			type: "getAllShopOrdersFailed",
			payload: error.response.data.message,
		})
	}
}
