import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AiOutlineArrowRight } from "react-icons/ai"
import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import Loader from "../Layout/Loader"
import { DataGrid } from "@mui/x-data-grid"
import { getAllShopOrders } from "../../redux/actions/order"

function AllShopOrders() {
	const { seller } = useSelector((state) => state.seller)
	const { shopOrders, isLoading } = useSelector((state) => state.order)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getAllShopOrders(seller._id))
	}, [])

	const handleDelete = (id) => {
		window.location.reload(true)
	}

	const columns = [
		{ field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

		{
			field: "status",
			headerName: "Status",
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.value === "Delivered" ? "greenColor" : "redColor"
			},
		},
		{
			field: "itemsQty",
			headerName: "Items Qty",
			type: "number",
			minWidth: 130,
			flex: 0.7,
		},

		{
			field: "total",
			headerName: "Total",
			type: "number",
			minWidth: 130,
			flex: 0.8,
		},

		{
			field: " ",
			flex: 1,
			minWidth: 150,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/orders/${params.id}`}>
							<Button>
								<AiOutlineArrowRight size={20} />
							</Button>
						</Link>
					</>
				)
			},
		},
	]

	const rows = []

	shopOrders &&
		shopOrders.forEach((item) => {
			rows.push({
				id: item._id,
				itemsQty: item.cart.reduce((sum, item) => sum + item.qty, 0),
				total: "US$ " + item.totalPrice,
				status: item.status,
			})
		})

	if (isLoading) return <Loader />

	return (
		<div className=" w-full mx-8 pt-1 mt-10 bg-white">
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 10,
						},
					},
				}}
				pageSizeOptions={[10]}
				disableRowSelectionOnClick
				autoHeight
			/>
		</div>
	)
}

export default AllShopOrders
