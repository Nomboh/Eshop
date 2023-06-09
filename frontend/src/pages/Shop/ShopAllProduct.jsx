import React from "react"
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader"
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar"
import AllProduct from "../../components/Shop/AllProduct"

function ShopAllProduct() {
	return (
		<div className="">
			<DashboardHeader />
			<div className=" flex justify-between w-full">
				<div className=" w-[80px] 800px:w-[330px]">
					<DashboardSideBar active={3} />
				</div>
				<div className="w-full justify-center flex">
					<AllProduct />
				</div>
			</div>
		</div>
	)
}

export default ShopAllProduct
