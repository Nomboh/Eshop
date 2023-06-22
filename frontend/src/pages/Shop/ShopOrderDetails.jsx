import React from "react"
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader"
import OrderDetails from "../../components/Shop/OrderDetails.jsx"
import Footer from "../../components/Layout/Footer"

function ShopOrderDetails() {
	return (
		<div className="">
			<DashboardHeader />
			<OrderDetails />
			<Footer />
		</div>
	)
}

export default ShopOrderDetails
