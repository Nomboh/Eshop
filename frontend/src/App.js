import React, { useEffect } from "react"
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import {
	LoginPage,
	SignupPage,
	ActivationPage,
	HomePage,
	ProductsPage,
	BestSellingPage,
	EventsPage,
	FAQPage,
	ProductDetailPage,
	ProfilePage,
	ShopeCreatePage,
	ShopLoginPage,
	SellerActivationPage,
} from "./routes/Routes.js"

import {
	DashBoardPage,
	ShopHomePage,
	ShopCreateProduct,
	ShopAllProduct,
	ShopCreateEvents,
	ShopAllEvents,
	ShopAllCoupouns,
	ShopPreviewPage,
} from "./routes/ShopRoutes.js"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Store from "./redux/store"
import { loadSeller, loadUser } from "./redux/actions/user"
import ProtectedRoute from "./routes/ProtectedRoute"
import SellerProtectedRoute from "./routes/SellerProtectedRoute"
import { allProducts } from "./redux/actions/product"
import { getAllEvents } from "./redux/actions/event"

const App = () => {
	useEffect(() => {
		Store.dispatch(loadUser())
		Store.dispatch(loadSeller())
		Store.dispatch(allProducts())
		Store.dispatch(getAllEvents())
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/sign-up" element={<SignupPage />} />
				<Route
					path="/activation/:activation_token"
					element={<ActivationPage />}
				/>
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/product/:name" element={<ProductDetailPage />} />
				<Route path="/best-selling" element={<BestSellingPage />} />
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}></Route>

				<Route path="/events" element={<EventsPage />} />
				<Route path="/faq" element={<FAQPage />} />

				{/* Shop Routes */}

				<Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

				<Route path="/shop-create" element={<ShopeCreatePage />} />
				<Route path="/shop-login" element={<ShopLoginPage />} />
				<Route
					path="/seller/activation/:activation_token"
					element={<SellerActivationPage />}
				/>

				<Route
					path="/dashboard"
					element={
						<SellerProtectedRoute>
							<DashBoardPage />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/shop/:id"
					element={
						<SellerProtectedRoute>
							<ShopHomePage />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/dashboard-create-product"
					element={
						<SellerProtectedRoute>
							<ShopCreateProduct />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/dashboard-products"
					element={
						<SellerProtectedRoute>
							<ShopAllProduct />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/dashboard-create-event"
					element={
						<SellerProtectedRoute>
							<ShopCreateEvents />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/dashboard-events"
					element={
						<SellerProtectedRoute>
							<ShopAllEvents />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/dashboard-coupouns"
					element={
						<SellerProtectedRoute>
							<ShopAllCoupouns />
						</SellerProtectedRoute>
					}
				/>
			</Routes>
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</BrowserRouter>
	)
}

export default App
