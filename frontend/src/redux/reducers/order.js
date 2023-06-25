import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	isLoading: true,
}

export const orderReducer = createReducer(initialState, {
	// get all order
	getAllOrdersRequest: (state) => {
		state.isLoading = true
	},
	getAllOrdersSuccess: (state, action) => {
		state.isLoading = false
		state.allOrders = action.payload
	},
	getAllOrdersFailed: (state, action) => {
		state.isLoading = false
		state.error = action.payload
	},

	// get all order in shop
	getAllShopOrdersRequest: (state) => {
		state.isLoading = true
	},
	getAllShopOrdersSuccess: (state, action) => {
		state.isLoading = false
		state.shopOrders = action.payload.shopOrders
		state.availableBalance = action.payload.availableBalance
	},
	getAllShopOrdersFailed: (state, action) => {
		state.isLoading = false
		state.error = action.payload
	},

	// get all orders for admin
	adminAllOrdersRequest: (state) => {
		state.adminOrderLoading = true
	},
	adminAllOrdersSuccess: (state, action) => {
		state.adminOrderLoading = false
		state.adminOrders = action.payload
	},
	adminAllOrdersFailed: (state, action) => {
		state.adminOrderLoading = false
		state.error = action.payload
	},

	clearErrors: (state) => {
		state.error = null
	},
})
