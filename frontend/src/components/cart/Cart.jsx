import { useState } from "react"
import { RxCross1 } from "react-icons/rx"
import styles from "../../styles/styles"
import { IoBagHandleOutline } from "react-icons/io5"
import { HiOutlineMinus, HiPlus } from "react-icons/hi"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { backend_url } from "../../server"
import { addToCart, removeFromCart } from "../../redux/actions/cart"
import { toast } from "react-toastify"

function Cart({ setOpenCart }) {
	const { cart } = useSelector((state) => state.cart)
	const dispatch = useDispatch()

	const removeCartHandler = (data) => {
		dispatch(removeFromCart(data))
	}

	const quantityChangeHandler = (data) => {
		dispatch(addToCart(data))
	}

	const totalPrice = cart.reduce(
		(acc, item) => acc + item.qty * item.discountPrice,
		0
	)

	return (
		<div className="fixed top-0 left-0 w-full h-screen bg-[#00000059] z-10">
			<div className="fixed top-0 right-0 h-full overflow-y-scroll w-5/6 800px:w-2/6 bg-white flex flex-col shadow-sm justify-between">
				{cart && cart.length === 0 ? (
					<div className="w-full h-screen flex justify-center items-center">
						<div className="w-full flex justify-end pt-5 pr-5 fixed top-3 right-3">
							<RxCross1
								size={25}
								className=" cursor-pointer"
								onClick={() => setOpenCart(false)}
							/>
						</div>
						<h2>Cart is empty</h2>
					</div>
				) : (
					<>
						<div>
							<div className="flex w-full justify-end pt-5 pr-5">
								<RxCross1
									size={25}
									className=" cursor-pointer"
									onClick={() => setOpenCart(false)}
								/>
							</div>
							{/* Items Length */}
							<div className={`${styles.noramlFlex} p-4`}>
								<IoBagHandleOutline size={23} />
								<h5 className=" pl-2 text-[20px] font-[500]">
									{" "}
									{cart.length} items
								</h5>
							</div>
							{/* Cart Items */}
							<div className="w-full border-t">
								{cart &&
									cart.map((cartData, index) => (
										<CartSingle
											data={cartData}
											key={index}
											removeCartHandler={removeCartHandler}
											quantityChangeHandler={quantityChangeHandler}
										/>
									))}
							</div>
						</div>

						<div className="px-5 mb-3">
							{/* checkout button */}
							<Link to={"/checkout"}>
								<div className=" h-[45px] flex item-center justify-center w-[100%] bg-[#e44343] rounded-[5px]">
									<h1 className=" self-center text-[#fff] text-[18px] font-[600]">
										Checkout now (USD {totalPrice})
									</h1>
								</div>
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

const CartSingle = ({ data, quantityChangeHandler, removeCartHandler }) => {
	const [value, setValue] = useState(data.qty)
	const totalPrice = data.discountPrice * value

	const increment = (data) => {
		if (data.stock <= value)
			toast.error(`Out of stock only ${data.stock} available`)
		else {
			setValue(value + 1)

			const updateCart = { ...data, qty: value + 1 }
			quantityChangeHandler(updateCart)
		}
	}

	const decrement = (data) => {
		setValue(value === 1 ? 1 : value - 1)
		const updateCart = { ...data, qty: value === 1 ? 1 : value - 1 }
		quantityChangeHandler(updateCart)
	}

	return (
		<div className="border-b p-4">
			<div className="w-full flex-col-reverse  800px:flex-row flex item-center">
				<div className=" self-center 800px:self-start">
					<div className=" flex flex-row 800px:flex-col">
						<div
							className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
							onClick={() => increment(data)}>
							<HiPlus size={18} color="#fff" />
						</div>
						<span className="px-[10px]">{data.qty}</span>
						<div
							className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
							onClick={() => decrement(data)}>
							<HiOutlineMinus size={25} color="#d879c" />
						</div>
					</div>
				</div>
				<img
					src={`${backend_url}${data && data?.images[0]}`}
					alt={data.name}
					className="w-[130px] h-min ml-2 rounded-[5px]"
				/>

				<div className=" w-full flex items-center">
					<div className=" pl-[5px] w-5/6">
						<h1>{data.name}</h1>
						<h4 className=" font-[400px] text-[15px] text-[#00000082]">
							${data.discountPrice} * {value}
						</h4>
						<h4 className=" font-[600] text-[17px] text-[#d02222] font-Roboto">
							US ${totalPrice}
						</h4>
					</div>
					<RxCross1
						onClick={() => removeCartHandler(data)}
						className="cursor-pointer ml-[10px] w-1/6 text-right self-center"
					/>
				</div>
			</div>
		</div>
	)
}

export default Cart
