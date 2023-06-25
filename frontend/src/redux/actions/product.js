import axios from "axios"
import { server } from "../../server"

// Create Product

export const createProduct = (newForm) => async (dispatch) => {
	try {
		dispatch({
			type: "productCreateRequest",
		})

		const config = { headers: { "Content-Type": "multipart/form-data" } }

		const { data } = await axios.post(
			`${server}/product/create-product`,
			newForm,
			config
		)

		dispatch({
			type: "productCreateSuccess",
			payload: data.product,
		})
	} catch (error) {
		console.log(error)
		dispatch({
			type: "productCreateFail",
			payload: error.response.data.message,
		})
	}
}

// Get All Products Shop
export const getAllProductsShop = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "getAllProductsRequest",
		})

		const { data } = await axios.get(
			`${server}/product/get-all-product-shop/${id}`
		)

		dispatch({
			type: "getAllProductsSuccess",
			payload: data.products,
		})
	} catch (error) {
		dispatch({
			type: "getAllProductsCreateFail",
			payload: error.response.data.message,
		})
	}
}

// Get All Products
export const allProducts = () => async (dispatch) => {
	try {
		dispatch({
			type: "allProductsRequest",
		})

		const { data } = await axios.get(`${server}/product/get-all-products`)

		dispatch({
			type: "allProductsSuccess",
			payload: data.products,
		})
	} catch (error) {
		dispatch({
			type: "allProductsCreateFail",
			payload: error.response.data.message,
		})
	}
}

// Delete Products of a Shop
export const deletProductsShop = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "deleteProductRequest",
		})

		const { data } = await axios.delete(
			`${server}/product/delete-shop-product/${id}`,
			{ withCredentials: true }
		)

		dispatch({
			type: "deleteProductSuccess",
			payload: data.message,
		})
	} catch (error) {
		dispatch({
			type: "deleteProductFail",
			payload: error.response.data.message,
		})
	}
}
