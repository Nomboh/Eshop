import { useState } from "react"
import { RxCross1 } from "react-icons/rx"
import styles from "../../styles/styles"
import { IoBagHandleOutline } from "react-icons/io5"
import { HiOutlineMinus, HiPlus } from "react-icons/hi"
import { Link } from "react-router-dom"

function Cart({ setOpenCart }) {
	const cartData = [
		{
			name: "Iphone 14 pro max 256 gb ssd ram sliver colour",
			description: "test",
			price: 654,
		},
		{
			name: "Iphone 14 pro max 256 gb ssd ram sliver colour",
			description: "test",
			price: 754,
		},
		{
			name: "Iphone 14 pro max 256 gb ssd ram sliver colour",
			description: "test",
			price: 586,
		},
	]
	return (
		<div className="fixed top-0 left-0 w-full h-screen bg-[#00000059] z-10">
			<div className="fixed top-0 right-0 min-h-full w-2/6 bg-white flex flex-col shadow-sm justify-between">
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
						<h5 className=" pl-2 text-[20px] font-[500]"> 3 items</h5>
					</div>
					{/* Cart Items */}
					<div className="w-full border-t">
						{cartData.map((cartData, index) => (
							<CartSingle data={cartData} key={index} />
						))}
					</div>
				</div>

				<div className="px-5 mb-3">
					{/* checkout button */}
					<Link to={"/checkout"}>
						<div className=" h-[45px] flex item-center justify-center w-[100%] bg-[#e44343] rounded-[5px]">
							<h1 className=" self-center text-[#fff] text-[18px] font-[600]">
								Checkout now (USD 1080)
							</h1>
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}

const CartSingle = ({ data }) => {
	const [value, setValue] = useState(1)
	const totalPrice = data.price * value

	return (
		<div className="border-b p-4">
			<div className="w-full flex-row flex item-center">
				<div className="">
					<div
						className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
						onClick={() => setValue(value + 1)}>
						<HiPlus size={18} color="#fff" />
					</div>
					<span className="px-[10px]">{value}</span>
					<div
						className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
						onClick={() => setValue(value === 1 ? 1 : value - 1)}>
						<HiOutlineMinus size={25} color="#d879c" />
					</div>
				</div>
				<img
					src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
					alt={data.name}
					className="w-[80px] h-[80px] ml-2"
				/>
				<div className=" pl-[5px]">
					<h1>{data.name}</h1>
					<h4 className=" font-[400px] text-[15px] text-[#00000082]">
						${data.price} * {value}
					</h4>
					<h4 className=" font-[600] text-[17px] text-[#d02222] font-Roboto">
						US ${totalPrice}
					</h4>
				</div>
				<RxCross1 className="cursor-pointer ml-[10px] self-center" />
			</div>
		</div>
	)
}

export default Cart
