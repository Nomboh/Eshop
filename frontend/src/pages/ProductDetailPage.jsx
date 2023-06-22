import { useState, useEffect } from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import ProductDetail from "../components/Products/ProductDetails"
import SuggestedProduct from "../components/Products/SuggestedProduct"
import { useParams, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"

function ProductDetailPage() {
	const { id } = useParams()
	const [searchParams] = useSearchParams()
	const [data, setData] = useState(null)
	const { allProducts } = useSelector((state) => state.product)
	const { allEvents } = useSelector((state) => state.event)

	const eventData = searchParams.get("isEvent")

	useEffect(() => {
		if (eventData) {
			const d = allEvents && allEvents.find((i) => i._id === id)

			setData(d)
		} else {
			const d = allProducts && allProducts.find((i) => i._id === id)

			setData(d)
		}
	}, [id, allProducts, eventData])

	return (
		<div>
			<Header />
			<ProductDetail data={data} />
			{!eventData && data && <SuggestedProduct data={data} />}
			<Footer />
		</div>
	)
}

export default ProductDetailPage
