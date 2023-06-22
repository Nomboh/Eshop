import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import { MdTrackChanges } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrders } from "../../redux/actions/order"
import { useEffect } from "react"

const TrackOrder = () => {
	const { allOrders } = useSelector((state) => state.order)
	const { user } = useSelector((state) => state.user)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getAllOrders(user._id))
	}, [dispatch])

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
						<Link to={`/user/track/order/${params.id}`}>
							<Button>
								<MdTrackChanges size={20} />
							</Button>
						</Link>
					</>
				)
			},
		},
	]

	const row = []

	allOrders &&
		allOrders.forEach((item) => {
			row.push({
				id: item._id,
				itemsQty: item.cart.length,
				total: "US$ " + item.totalPrice,
				status: item.status,
			})
		})
	return (
		<div className="pl-8 pt-1">
			<DataGrid
				rows={row}
				columns={columns}
				pageSizeOptions={[10]}
				disableSelectionOnClick
				autoHeight
			/>
		</div>
	)
}

export default TrackOrder
