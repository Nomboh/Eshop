import { useState, useEffect } from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import ProductDetail from "../components/Products/ProductDetails"
import SuggestedProduct from "../components/Products/SuggestedProduct"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

function ProductDetailPage() {
	const { name } = useParams()
	const [data, setData] = useState(null)
	const { allProducts } = useSelector((state) => state.product)

	const productName = name.replace(/-/g, " ")

	useEffect(() => {
		if (allProducts) {
			const d = allProducts.find((i) => i.name === productName)
			console.log(
				allProducts.find(
					(p) => p.name.toLowerCase() === productName.toLowerCase()
				)
			)
			setData(d)
		}
	}, [allProducts])

	return (
		<div>
			<Header />
			<ProductDetail data={data} />
			{data && <SuggestedProduct data={data} />}
			<Footer />
		</div>
	)
}

export default ProductDetailPage
