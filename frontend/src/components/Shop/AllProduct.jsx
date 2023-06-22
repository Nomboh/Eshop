import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
	deletProductsShop,
	getAllProductsShop,
} from "../../redux/actions/product"
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai"
import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import Loader from "../Layout/Loader"
import { DataGrid } from "@mui/x-data-grid"

function AllProduct() {
	const { products, isLoading } = useSelector((state) => state.product)
	const { seller } = useSelector((state) => state.seller)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getAllProductsShop(seller._id))
	}, [dispatch, seller._id])

	const handleDelete = (id) => {
		dispatch(deletProductsShop(id))
		window.location.reload(true)
	}

	const columns = [
		{ field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
		{
			field: "name",
			headerName: "Name",
			minWidth: 180,
			flex: 1.4,
		},
		{
			field: "price",
			headerName: "Price",
			minWidth: 100,
			flex: 0.6,
		},
		{
			field: "stock",
			headerName: "Stock",
			type: "number",
			minWidth: 80,
			flex: 0.5,
		},

		{
			field: "sold",
			headerName: "Sold out",
			type: "number",
			minWidth: 130,
			flex: 0.6,
		},
		{
			field: "Preview",
			flex: 0.8,
			minWidth: 100,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/product/${params.id}`}>
							<Button>
								<AiOutlineEye size={20} />
							</Button>
						</Link>
					</>
				)
			},
		},
		{
			field: "Delete",
			flex: 0.8,
			minWidth: 120,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Button color="error" onClick={() => handleDelete(params.id)}>
							<AiOutlineDelete size={20} />
						</Button>
					</>
				)
			},
		},
	]

	const rows = []

	products &&
		products.forEach((product) =>
			rows.push({
				id: product._id,
				name: product.name,
				price: "US$" + product.discountPrice,
				stock: product.stock,
				sold: 10,
			})
		)

	if (isLoading) return <Loader />

	return (
		<div className=" w-full mx-8 pt-1 mt-10 bg-white">
			<DataGrid
				rows={rows}
				columns={columns}
				pageSizeOptions={[10]}
				disableRowSelectionOnClick
				autoHeight
			/>
		</div>
	)
}

export default AllProduct
