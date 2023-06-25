import { useEffect, useState } from "react"
import styles from "../../styles/styles"
import ProductDetailsInfo from "./ProductDetailsInfo"
import {
	AiFillHeart,
	AiOutlineHeart,
	AiOutlineShoppingCart,
	AiOutlineMessage,
} from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { getAllProductsShop } from "../../redux/actions/product"
import { backend_url, server } from "../../server"
import { toast } from "react-toastify"
import { addToCart } from "../../redux/actions/cart"
import { Link, useNavigate } from "react-router-dom"
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist"
import axios from "axios"

function ProductDetails({ data }) {
	const [count, setCount] = useState(1)
	const [click, setClick] = useState(false)
	const [select, setSelect] = useState(0)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { products } = useSelector((state) => state.product)
	const { user, isAuthenticated } = useSelector((state) => state.user)
	const { cart } = useSelector((state) => state.cart)
	const { wishlist } = useSelector((state) => state.wishlist)

	useEffect(() => {
		dispatch(getAllProductsShop(data && data?.shop._id))
		if (wishlist && wishlist?.find((wl) => wl._id === data?._id)) {
			setClick(true)
		} else {
			setClick(false)
		}
	}, [wishlist, dispatch, data])

	const removeFromWishlistHandler = (data) => {
		setClick(!click)
		dispatch(removeFromWishlist(data))
	}

	const addToWishlistHandler = (data) => {
		setClick(!click)
		dispatch(addToWishlist(data))
	}

	const incrementCount = () => {
		setCount(count + 1)
	}
	const decrementCount = () => {
		if (count > 1) {
			setCount(count - 1)
		}
	}

	const handleMessageSubmit = async () => {
		if (isAuthenticated) {
			const groupTitle = user._id + data?.shop._id
			const userId = user._id
			const sellerId = data.shop._id

			await axios
				.post(`${server}/conversation/create-conversation`, {
					groupTitle,
					userId,
					sellerId,
				})
				.then((res) => {
					navigate(`/inbox?${res.data.conversation._id}`)
				})
				.catch((err) => toast.error(err.response.data.message))
		} else {
			toast.error("Please login to create a conversation")
		}
	}

	const handleAddToCart = (id) => {
		const itemInCart = cart.find((ct) => ct._id === id)
		if (itemInCart) {
			toast.error("Item already in Cart")
		} else {
			if (data.stock < count)
				toast.error(`Product limite excited ${data.stock}`)
			else {
				const cartData = { ...data, qty: count }
				dispatch(addToCart(cartData))
				toast.success("Item added to cart successfully")
			}
		}
	}

	const totalReview =
		products &&
		products.reduce((total, product) => total + product.reviews.length, 0)

	const totalRatings =
		products &&
		products.reduce(
			(total, product) =>
				total + product.reviews.reduce((sum, rat) => sum + rat.rating, 0),
			0
		)

	const ratingsAverage = totalRatings / totalReview || 0
	return (
		<div className=" bg-white">
			{data ? (
				<div className={`${styles.section} 800px:w-[80%] w-[90%] `}>
					<div className=" w-full py-5">
						<div className="block w-full 800px:flex">
							<div className="w-full 800px:w-[50%]">
								<img
									src={`${backend_url}${data.images[select]}`}
									alt=""
									className=" w-[80%]"
								/>

								<div className="w-full gap-2 flex overflow-x-scroll mt-3">
									{data &&
										data.images.map((i, index) => (
											<div
												key={index}
												className={`${
													select === 0 ? "border" : "null"
												} cursor-pointer`}>
												<img
													className=" h-[150px] object-cover overflow-hidden mr-3 mt-3"
													src={`${backend_url}${i}`}
													alt=""
													onClick={() => setSelect(index)}
												/>
											</div>
										))}
								</div>
							</div>
							<div className="w-full 800px:w-[50%] pt-5 800px:ml-5">
								<h1 className={`${styles.productTitle}`}>{data.name}</h1>

								<p>{data.description}</p>
								<div className="flex pt-3">
									<h4 className={`${styles.productDiscountPrice}`}>
										{data.discountPrice}$
									</h4>
									<h3 className={`${styles.price}`}>
										{data.originalPrice ? data.originalPrice + "$" : null}
									</h3>
								</div>

								<div className="flex items-center mt-12 justify-between pr-3">
									<div>
										<button
											className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
											onClick={decrementCount}>
											-
										</button>
										<span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
											{count}
										</span>
										<button
											className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
											onClick={incrementCount}>
											+
										</button>
									</div>

									<div>
										{click ? (
											<AiFillHeart
												size={30}
												className="cursor-pointer"
												onClick={() => removeFromWishlistHandler(data)}
												color={click ? "red" : "#333"}
												title="Remove from wishlist"
											/>
										) : (
											<AiOutlineHeart
												size={30}
												className="cursor-pointer"
												onClick={() => addToWishlistHandler(data)}
												color={click ? "red" : "#333"}
												title="Add to wishlist"
											/>
										)}
									</div>
								</div>

								<div
									className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
									onClick={() => handleAddToCart(data._id)}>
									<span className="text-white flex items-center">
										Add to cart <AiOutlineShoppingCart className="ml-1" />
									</span>
								</div>

								<div className="flex items-center pt-8">
									<Link to={`/shop/preview/${data.shop._id}`}>
										<img
											src={`${backend_url}${data.shop.avatar}`}
											alt=""
											className="w-[50px] h-[50px] rounded-full mr-2"
										/>
									</Link>
									<div className="pr-8">
										<Link to={`/shop/preview/${data.shop._id}`}>
											<h3 className={`${styles.shop_name} pb-1 pt-1`}>
												{data.shop.name}
											</h3>
										</Link>
										<h5 className="pb-3 text-[15px]">
											({ratingsAverage}/5) Ratings
										</h5>
									</div>
									<div
										className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
										onClick={handleMessageSubmit}>
										<span className="text-white flex items-center">
											Send Message <AiOutlineMessage className="ml-1" />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<ProductDetailsInfo
						ratingsAverage={ratingsAverage}
						totalReview={totalReview}
						data={data}
						products={products}
					/>
					<br />
					<br />
				</div>
			) : null}
		</div>
	)
}

export default ProductDetails
