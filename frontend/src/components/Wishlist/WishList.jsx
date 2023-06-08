import { useState } from "react"
import { RxCross1 } from "react-icons/rx"
import styles from "../../styles/styles"
import { IoBagHandleOutline, IoHeartOutline } from "react-icons/io5"
import { BsCartPlus } from "react-icons/bs"
import { Link } from "react-router-dom"

function WhishList({ setOpenWishList }) {
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
							onClick={() => setOpenWishList(false)}
						/>
					</div>
					{/* Items Length */}
					<div className={`${styles.noramlFlex} p-4`}>
						<IoHeartOutline size={23} />
						<h5 className=" pl-2 text-[20px] font-[500]"> 3 items</h5>
					</div>
					{/* Cart Items */}
					<div className="w-full border-t">
						{cartData.map((cartData, index) => (
							<CartSingle data={cartData} key={index} />
						))}
					</div>
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
				<RxCross1 className=" cursor-pointer self-center" />

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
				<BsCartPlus
					size={30}
					title="Add to cart"
					className=" self-center cursor-pointer"
				/>
			</div>
		</div>
	)
}

export default WhishList
