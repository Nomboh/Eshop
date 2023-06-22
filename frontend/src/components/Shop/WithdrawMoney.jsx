import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllShopOrders } from "../../redux/actions/order"
import styles from "../../styles/styles"

const WithdrawMoney = () => {
	const dispatch = useDispatch()
	const { availableBalance } = useSelector((state) => state.order)
	const { seller } = useSelector((state) => state.seller)

	useEffect(() => {
		dispatch(getAllShopOrders(seller._id))
	}, [dispatch])

	return (
		<div className="w-full h-[90vh] p-8">
			<div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
				<h5 className="text-[20px] pb-4">
					Available Balance: ${availableBalance}
				</h5>
				<div className={`${styles.button} text-white !h-[42px] !rounded`}>
					Withdraw
				</div>
			</div>
		</div>
	)
}

export default WithdrawMoney
