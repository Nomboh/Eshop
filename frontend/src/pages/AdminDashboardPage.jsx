import React from "react"
import AdminHeader from "../components/Layout/AdminHeader"
import AdminSidebar from "../components/Admin/Layout/AdminSidebar"
import AdminDashboardMain from "../components/Admin/AdminDashboardMain.jsx"

function AdminDashboardPage() {
	return (
		<div>
			<AdminHeader />
			<div className="flex  items-start justify-between w-full">
				<div className=" w-[80px] 800px:w-[330px]">
					<AdminSidebar active={1} />
				</div>
				<AdminDashboardMain />
			</div>
		</div>
	)
}

export default AdminDashboardPage
