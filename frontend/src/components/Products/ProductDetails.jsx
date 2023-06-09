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
import { backend_url } from "../../server"

function ProductDetails({ data }) {
	const [count, setCount] = useState(1)
	const [click, setClick] = useState(false)
	const [select, setSelect] = useState(0)
	const dispatch = useDispatch()

	const { products } = useSelector((state) => state.product)

	useEffect(() => {
		dispatch(getAllProductsShop(data && data.shop._id))
	}, [dispatch, data])

	const incrementCount = () => {
		setCount(count + 1)
	}
	const decrementCount = () => {
		if (count > 1) {
			setCount(count - 1)
		}
	}

	const handleMessageSubmit = () => {
		console.log("chat")
	}
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

								<div className="w-full gap-2 flex overflow-x-scroll">
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
												onClick={() => setClick(!click)}
												color={click ? "red" : "#333"}
												title="Remove from wishlist"
											/>
										) : (
											<AiOutlineHeart
												size={30}
												className="cursor-pointer"
												onClick={() => setClick(!click)}
												color={click ? "red" : "#333"}
												title="Add to wishlist"
											/>
										)}
									</div>
								</div>

								<div
									className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}>
									<span className="text-white flex items-center">
										Add to cart <AiOutlineShoppingCart className="ml-1" />
									</span>
								</div>

								<div className="flex items-center pt-8">
									<img
										src={`${backend_url}${data?.shop?.avatar}`}
										alt=""
										className="w-[50px] h-[50px] rounded-full mr-2"
									/>
									<div className="pr-8">
										<h3 className={`${styles.shop_name} pb-1 pt-1`}>
											{data.shop.name}
										</h3>
										<h5 className="pb-3 text-[15px]">(4.5) Ratings</h5>
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
					<ProductDetailsInfo data={data} products={products} />
					<br />
					<br />
				</div>
			) : null}
		</div>
	)
}

export default ProductDetails
