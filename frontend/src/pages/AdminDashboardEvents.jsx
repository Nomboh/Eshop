import React from "react"
import AdminHeader from "../components/Layout/AdminHeader"
import AdminSidebar from "../components/Admin/Layout/AdminSidebar"
import AllEvents from "../components/Admin/AllEvent.jsx"

const AdminDashboardEvents = () => {
	return (
		<div>
			<AdminHeader />
			<div className="w-full flex">
				<div className="flex items-start justify-between w-full">
					<div className="w-[80px] 800px:w-[330px]">
						<AdminSidebar active={6} />
					</div>
					<AllEvents />
				</div>
			</div>
		</div>
	)
}

export default AdminDashboardEvents
