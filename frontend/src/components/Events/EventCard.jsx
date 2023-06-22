import React from "react"
import styles from "../../styles/styles"
import CountDown from "./CountDown"
import { backend_url } from "../../server"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { addToCart } from "../../redux/actions/cart"

const EventCard = ({ active, data }) => {
	const { cart } = useSelector((state) => state.cart)
	const dispatch = useDispatch()
	const handleAddToCart = (id) => {
		const itemInCart = cart.find((ct) => ct._id === id)
		if (itemInCart) {
			toast.error("Item already in Cart")
		} else {
			if (data.stock < 1) toast.error(`Product limite excited ${data.stock}`)
			else {
				const cartData = { ...data, qty: 1 }
				dispatch(addToCart(cartData))
				toast.success("Item added to cart successfully")
			}
		}
	}
	return (
		<div
			className={`w-full block bg-white rounded-lg ${
				active ? "unset" : "mb-12"
			} lg:flex p-2`}>
			<div className="w-full lg:-w[50%] m-auto">
				<img src={`${backend_url}${data.images[0]}`} alt="" />
			</div>
			<div className="w-full lg:[w-50%] 800px:ml-5 800px:mt-5 flex flex-col justify-start">
				<h2 className={`${styles.productTitle}`}>{data.name}</h2>
				<p>{data.description}</p>
				<div className="flex py-2 justify-between">
					<div className="flex">
						<h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
							{data.originalPrice}$
						</h5>
						<h5 className="font-bold text-[20px] text-[#333] font-Roboto">
							{data.discountPrice}$
						</h5>
					</div>
					<span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
						{data.sold_out} sold
					</span>
				</div>
				<CountDown data={data} />
				<br />

				<div className="flex items-center">
					<Link to={`/product/${data._id}?isEvent=true`}>
						<div className={`${styles.button} text-[#fff]`}>See Details</div>
					</Link>
					<div
						onClick={() => handleAddToCart(data._id)}
						className={`${styles.button} text-[#fff] ml-5`}>
						Add to cart
					</div>
				</div>
			</div>
		</div>
	)
}

export default EventCard
