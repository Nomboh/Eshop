import axios from "axios"
import { server } from "../../server"

// load user
export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "LoadUserRequest",
		})
		const { data } = await axios.get(`${server}/user/getuser`, {
			withCredentials: true,
		})
		dispatch({
			type: "LoadUserSuccess",
			payload: data.user,
		})
	} catch (error) {
		dispatch({
			type: "LoadUserFail",
			payload: error.response.data.message,
		})
	}
}

// load seller
export const loadSeller = () => async (dispatch) => {
	try {
		dispatch({
			type: "LoadSellerRequest",
		})
		const { data } = await axios.get(`${server}/shop/getSeller`, {
			withCredentials: true,
		})

		dispatch({
			type: "LoadSellerSuccess",
			payload: data.seller,
		})
	} catch (error) {
		console.log(error)
		dispatch({
			type: "LoadSellerFail",
			payload: error.response.data.message,
		})
	}
}

// Update user information
export const updateUserInformation =
	({ email, password, phoneNumber, name }) =>
	async (dispatch) => {
		dispatch({
			type: "updateUserInfoRequest",
		})

		try {
			const { data } = await axios.put(
				`${server}/user/update-user-info`,
				{
					email,
					password,
					phoneNumber,
					name,
				},
				{
					withCredentials: true,
				}
			)

			dispatch({
				type: "updateUserInfoSuccess",
				payload: data.user,
			})
		} catch (error) {
			dispatch({
				type: "updateUserInfoFailed",
				payload: error.response.data.message,
			})
		}
	}

// Update user Address
export const updateUserAddress =
	({ country, city, zipCode, address1, address2, addressType }) =>
	async (dispatch) => {
		dispatch({
			type: "updateUserAddressRequest",
		})

		try {
			const { data } = await axios.put(
				`${server}/user/update-user-address`,
				{
					country,
					city,
					zipCode,
					address1,
					address2,
					addressType,
				},
				{
					withCredentials: true,
				}
			)

			dispatch({
				type: "updateUserAddressSuccess",
				payload: {
					user: data.user,
					successMessage: "Address Added successfully",
				},
			})
		} catch (error) {
			dispatch({
				type: "updateUserAddressFailed",
				payload: error.response.data.message,
			})
		}
	}

// Delete user Address
export const deleteUserAddress = (id) => async (dispatch) => {
	dispatch({
		type: "deleteUserAddressRequest",
	})

	try {
		const { data } = await axios.delete(
			`${server}/user/delete-user-address/${id}`,
			{
				withCredentials: true,
			}
		)

		dispatch({
			type: "deleteUserAddressSuccess",
			payload: {
				user: data.user,
				successMessage: "Address deleted successfully",
			},
		})
	} catch (error) {
		dispatch({
			type: "deleteUserAddressFailed",
			payload: error.response.data.message,
		})
	}
}

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
	try {
		dispatch({
			type: "getAllUsersRequest",
		})

		const { data } = await axios.get(`${server}/user/admin-all-users`, {
			withCredentials: true,
		})

		dispatch({
			type: "getAllUsersSuccess",
			payload: data.users,
		})
	} catch (error) {
		dispatch({
			type: "getAllUsersFailed",
			payload: error.response.data.message,
		})
	}
}
