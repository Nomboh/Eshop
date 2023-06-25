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

		dispatch({
			type: "getAllShopOrdersSuccess",
			payload: {
				shopOrders: data.orders,
			},
		})
	} catch (error) {
		dispatch({
			type: "getAllShopOrdersFailed",
			payload: error.response.data.message,
		})
	}
}

// get all orders of Admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
	try {
		dispatch({
			type: "adminAllOrdersRequest",
		})

		const { data } = await axios.get(`${server}/order/admin-all-orders`, {
			withCredentials: true,
		})

		dispatch({
			type: "adminAllOrdersSuccess",
			payload: data.orders,
		})
	} catch (error) {
		dispatch({
			type: "adminAllOrdersFailed",
			payload: error.response.data.message,
		})
	}
}
