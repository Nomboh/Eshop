import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import { MdOutlineTrackChanges } from "react-icons/md"

const TrackOrder = () => {
	const orders = [
		{
			_id: "7463hvbfbhfbrtr28820221",
			orderItems: [
				{
					name: "Iphone 14 pro max",
				},
			],
			totalPrice: 120,
			orderStatus: "Processing",
		},
	]

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
			minWidth: 130,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/order/${params.id}`}>
							<Button>
								<MdOutlineTrackChanges size={20} />
							</Button>
						</Link>
					</>
				)
			},
		},
	]

	const row = []

	orders &&
		orders.forEach((item) => {
			row.push({
				id: item._id,
				itemsQty: item.orderItems.length,
				total: "US$ " + item.totalPrice,
				status: item.orderStatus,
			})
		})

	return (
		<div className="pl-8 pt-1">
			<DataGrid
				rows={row}
				columns={columns}
				pageSize={10}
				disableSelectionOnClick
				autoHeight
			/>
		</div>
	)
}

export default TrackOrder
