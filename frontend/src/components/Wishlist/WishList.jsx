import { useState } from "react"
import { RxCross1 } from "react-icons/rx"
import styles from "../../styles/styles"
import { IoHeartOutline } from "react-icons/io5"
import { BsCartPlus } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { removeFromWishlist } from "../../redux/actions/wishlist"
import { backend_url } from "../../server"
import { toast } from "react-toastify"
import { addToCart } from "../../redux/actions/cart"

function WhishList({ setOpenWishList }) {
	const { wishlist } = useSelector((state) => state.wishlist)
	const { cart } = useSelector((state) => state.cart)
	const dispatch = useDispatch()

	const removeFromWishlistHandler = (data) => {
		dispatch(removeFromWishlist(data))
	}

	const handleAddToCart = (id) => {
		const itemExist = cart && cart.find((ct) => ct._id === id)
		if (itemExist) {
			toast.error("Item already exit")
		} else {
			if (cart.stock < 1)
				toast.error(`Out of stock only ${cart.stock} available`)
			else {
				const cartData = { ...cart, qty: 1 }
				dispatch(addToCart(cartData))
				toast.success("Item added to cart successfully")
			}
		}
	}

	return (
		<div className="fixed top-0  left-0 w-full h-screen bg-[#00000059] z-[1000]">
			<div className="fixed top-0  right-0 h-full overflow-y-scroll w-5/6 800px:w-2/6 bg-white flex flex-col shadow-sm justify-between">
				{wishlist && wishlist.length === 0 ? (
					<div className="w-full h-screen flex  justify-center items-center">
						<div className="w-full flex justify-end pt-5 pr-5 fixed top-3 right-3">
							<RxCross1
								size={25}
								className=" cursor-pointer"
								onClick={() => setOpenWishList(false)}
							/>
						</div>
						<h2>Wishlist is empty</h2>
					</div>
				) : (
					<div>
						<div className="flex w-full justify-end pt-5 pr-5">
							<RxCross1
								size={25}
								className=" cursor-pointer"
								onClick={() => setOpenWishList(false)}
							/>
						</div>
						{/* Items Length */}
						<div className={`${styles.noramlFlex} p-4`}>
							<IoHeartOutline size={23} />
							<h5 className=" pl-2 text-[20px] font-[500]">
								{" "}
								{wishlist.length} items
							</h5>
						</div>
						{/* Cart Items */}
						<div className="w-full border-t">
							{wishlist &&
								wishlist.map((cartData, index) => (
									<CartSingle
										data={cartData}
										key={index}
										handleAddToCart={handleAddToCart}
										removeFromWishlistHandler={removeFromWishlistHandler}
									/>
								))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

const CartSingle = ({ data, removeFromWishlistHandler, handleAddToCart }) => {
	const [value, setValue] = useState(1)
	const totalPrice = data.discountPrice * value

	return (
		<div className="border-b p-4">
			<div className="w-full flex-col 800px:flex-row flex item-center">
				<RxCross1
					className=" cursor-pointer self-center"
					onClick={() => removeFromWishlistHandler(data)}
				/>

				<img
					src={`${backend_url}${data.images[0]}`}
					alt={data.name}
					className="w-[80px] h-[80px] ml-2"
				/>

				<div className=" pl-[5px] ">
					<h1>{data.name}</h1>
					<h4 className=" font-[400px] text-[15px] text-[#00000082]">
						${data.discountPrice} * {value}
					</h4>
					<h4 className=" font-[600] text-[17px] text-[#d02222] font-Roboto">
						US ${totalPrice}
					</h4>
				</div>
				<BsCartPlus
					size={30}
					title="Add to cart"
					onClick={() => handleAddToCart(data._id)}
					className=" self-center cursor-pointer "
				/>
			</div>
		</div>
	)
}

export default WhishList
