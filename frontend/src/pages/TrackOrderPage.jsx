import React from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import TrackUserOrder from "../components/Profile/TrackUserOrder"

const TrackOrderPage = () => {
	return (
		<div>
			<Header />
			<TrackUserOrder />
			<Footer />
		</div>
	)
}

export default TrackOrderPage
