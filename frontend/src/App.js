import React, { useEffect, useState } from "react"
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
	CheckoutPage,
	PaymentPage,
	OrderSuccessPage,
	OrderDetailPage,
	TrackOrderPage,
	UserInbox,
} from "./routes/Routes"

import {
	DashBoardPage,
	ShopHomePage,
	ShopCreateProduct,
	ShopAllProduct,
	ShopCreateEvents,
	ShopAllEvents,
	ShopAllCoupouns,
	ShopPreviewPage,
	ShopAllOrders,
	ShopOrderDetails,
	ShopAllRefunds,
	ShopSettingsPage,
	WithdrawMoneyPage,
	ShopInboxPage,
} from "./routes/ShopRoutes"

import {
	AdminDashboardPage,
	AdminDashboardUsers,
	AdminDashboardSellers,
	AdminDashboardOrders,
	AdminDashboardProducts,
	AdminDashboardEvents,
	AdminDashboardWithdraw,
} from "./routes/AdminRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Store from "./redux/store"
import { loadSeller, loadUser } from "./redux/actions/user"
import ProtectedRoute from "./routes/ProtectedRoute"
import SellerProtectedRoute from "./routes/SellerProtectedRoute"
import AdminProtectedRoute from "./routes/AdminProtectedRoute"
import { allProducts } from "./redux/actions/product"
import { getAllEvents } from "./redux/actions/event"
import axios from "axios"
import { server } from "./server"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const App = () => {
	const [stripeapikey, setStripeapikey] = useState("")

	const getStripApiKey = async () => {
		try {
			const { data } = await axios.get(`${server}/payment/stripeapikey`)

			setStripeapikey(data.stripeApiKey)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		Store.dispatch(loadUser())
		Store.dispatch(loadSeller())
		Store.dispatch(allProducts())
		Store.dispatch(getAllEvents())
		getStripApiKey()
	}, [])

	return (
		<BrowserRouter>
			{stripeapikey && (
				<Elements stripe={loadStripe(stripeapikey)}>
					<Routes>
						<Route
							path="/payment"
							element={
								<ProtectedRoute>
									<PaymentPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Elements>
			)}

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/sign-up" element={<SignupPage />} />
				<Route
					path="/activation/:activation_token"
					element={<ActivationPage />}
				/>
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/product/:id" element={<ProductDetailPage />} />
				<Route path="/best-selling" element={<BestSellingPage />} />
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}></Route>

				<Route
					path="/inbox"
					element={
						<ProtectedRoute>
							<UserInbox />
						</ProtectedRoute>
					}></Route>

				<Route
					path="/user/order/:id"
					element={
						<ProtectedRoute>
							<OrderDetailPage />
						</ProtectedRoute>
					}></Route>

				<Route
					path="/user/track/order/:id"
					element={
						<ProtectedRoute>
							<TrackOrderPage />
						</ProtectedRoute>
					}></Route>

				<Route path="/events" element={<EventsPage />} />
				<Route path="/faq" element={<FAQPage />} />

				<Route
					path="/checkout"
					element={
						<ProtectedRoute>
							<CheckoutPage />
						</ProtectedRoute>
					}
				/>

				<Route path="/order/success/" element={<OrderSuccessPage />} />

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
					path="/dashboard-messages"
					element={
						<SellerProtectedRoute>
							<ShopInboxPage />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/settings"
					element={
						<SellerProtectedRoute>
							<ShopSettingsPage />
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
					path="/dashboard-orders"
					element={
						<SellerProtectedRoute>
							<ShopAllOrders />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/dashboard-withdraw-money"
					element={
						<SellerProtectedRoute>
							<WithdrawMoneyPage />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/dashboard-refunds"
					element={
						<SellerProtectedRoute>
							<ShopAllRefunds />
						</SellerProtectedRoute>
					}
				/>

				<Route
					path="/orders/:id"
					element={
						<SellerProtectedRoute>
							<ShopOrderDetails />
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

				{/* Admin Routes */}

				{/* Admin Dashboard */}
				<Route
					path="/admin/dashboard"
					element={
						<AdminProtectedRoute>
							<AdminDashboardPage />
						</AdminProtectedRoute>
					}
				/>

				{/* Admin users */}
				<Route
					path="/admin-users"
					element={
						<AdminProtectedRoute>
							<AdminDashboardUsers />
						</AdminProtectedRoute>
					}
				/>

				{/* Admin sellers */}
				<Route
					path="/admin-sellers"
					element={
						<AdminProtectedRoute>
							<AdminDashboardSellers />
						</AdminProtectedRoute>
					}
				/>

				{/* Admin orders */}
				<Route
					path="/admin-orders"
					element={
						<AdminProtectedRoute>
							<AdminDashboardOrders />
						</AdminProtectedRoute>
					}
				/>

				{/* Admin Products */}
				<Route
					path="/admin-products"
					element={
						<AdminProtectedRoute>
							<AdminDashboardProducts />
						</AdminProtectedRoute>
					}
				/>

				{/* Admin Events */}
				<Route
					path="/admin-events"
					element={
						<AdminProtectedRoute>
							<AdminDashboardEvents />
						</AdminProtectedRoute>
					}
				/>

				{/* Admin Withdraw requests*/}
				<Route
					path="/admin-withdraw-request"
					element={
						<AdminProtectedRoute>
							<AdminDashboardWithdraw />
						</AdminProtectedRoute>
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
