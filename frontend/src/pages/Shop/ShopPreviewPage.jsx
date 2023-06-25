import React from "react"
import styles from "../../styles/styles"
import ShopInfo from "../../components/Shop/ShopInfo"
import ShopProfileData from "../../components/Shop/ShopProfileData"

const ShopPreviewPage = () => {
	return (
		<div className={`${styles.section} bg-[#f5f5f5]`}>
			<div className="w-full overflow-y-scroll flex flex-col 800px:flex-row py-10 justify-between">
				<div className=" w-full 800px:w-[25%] bg-[#fff] rounded-[4px] shadow-sm overflow-y-scroll 800px:h-[90vh] mb-20 sticky top-10 left-0 800px:z-10">
					<ShopInfo isOwner={false} />
				</div>
				<div className=" w-full 800px:w-[72%] rounded-[4px]">
					<ShopProfileData isOwner={false} />
				</div>
			</div>
		</div>
	)
}

export default ShopPreviewPage
