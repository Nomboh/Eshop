import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	isLoading: true,
}

export const productReducer = createReducer(initialState, {
	productCreateRequest: (state) => {
		state.isLoading = true
	},

	productCreateSuccess: (state, action) => {
		state.isLoading = false
		state.product = action.payload
		state.success = true
	},

	productCreateFail: (state, action) => {
		state.isLoading = false
		state.error = action.payload
		state.success = false
	},

	// Get All products of a shop
	getAllProductsRequest: (state) => {
		state.isLoading = true
	},

	getAllProductsSuccess: (state, action) => {
		state.isLoading = false
		state.products = action.payload
	},

	getAllProductsCreateFail: (state, action) => {
		state.isLoading = false
		state.error = action.payload
	},

	// Get All products
	allProductsRequest: (state) => {
		state.isLoading = true
	},

	allProductsSuccess: (state, action) => {
		state.isLoading = false
		state.allProducts = action.payload
	},

	allProductsCreateFail: (state, action) => {
		state.isLoading = false
		state.error = action.payload
	},

	// Delete products of a shop
	deleteProductRequest: (state) => {
		state.isLoading = true
	},

	deleteProductSuccess: (state, action) => {
		state.isLoading = false
		state.message = action.payload
	},

	deleteProductFail: (state, action) => {
		state.isLoading = false
		state.error = action.payload
	},

	clearErrors: (state) => {
		state.error = null
	},
})
