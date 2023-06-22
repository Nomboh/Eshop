import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	isAuthenticated: false,
}

export const userReducer = createReducer(initialState, {
	LoadUserRequest: (state) => {
		state.loading = true
	},
	LoadUserSuccess: (state, action) => {
		state.isAuthenticated = true
		state.loading = false
		state.user = action.payload
	},
	LoadUserFail: (state, action) => {
		state.loading = false
		state.error = action.payload
		state.isAuthenticated = false
	},

	// update user info request
	updateUserInfoRequest: (state) => {
		state.loading = true
	},

	updateUserInfoSuccess: (state, action) => {
		state.loading = false
		state.user = action.payload
	},

	updateUserInfoFailed: (state, action) => {
		state.loading = false
		state.error = action.payload
	},

	// update user address request
	updateUserAddressRequest: (state) => {
		state.loadingAddress = true
	},

	updateUserAddressSuccess: (state, action) => {
		state.loadingAddress = false
		state.user = action.payload.user
		state.successMessage = action.payload.successMessage
	},

	updateUserAddressFailed: (state, action) => {
		state.loadingAddress = false
		state.error = action.payload
	},

	// delete user address request
	deleteUserAddressRequest: (state) => {
		state.loadingAddress = true
	},

	deleteUserAddressSuccess: (state, action) => {
		state.loadingAddress = false
		state.user = action.payload.user
		state.successMessage = action.payload.successMessage
	},

	deleteUserAddressFailed: (state, action) => {
		state.loadingAddress = false
		state.error = action.payload
	},

	clearErrors: (state) => {
		state.error = null
	},

	clearSuccessMessage: (state) => {
		state.successMessage = null
	},
})
