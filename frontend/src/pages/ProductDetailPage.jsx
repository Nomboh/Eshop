import { useState, useEffect } from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import ProductDetail from "../components/Products/ProductDetails"
import SuggestedProduct from "../components/Products/SuggestedProduct"
import { useParams, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { allProducts } from "../redux/actions/product"

function ProductDetailPage() {
	const { id } = useParams()
	const [searchParams] = useSearchParams()
	const [data, setData] = useState(null)
	const { allProducts: products } = useSelector((state) => state.product)
	const { allEvents } = useSelector((state) => state.event)

	const eventData = searchParams.get("isEvent")

	useEffect(() => {
		if (eventData) {
			const d = allEvents && allEvents.find((i) => i._id === id)

			setData(d)
		} else {
			const d = products && products.find((i) => i._id === id)

			setData(d)
		}
	}, [id, products, eventData])

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
