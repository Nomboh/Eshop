import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { categoriesData } from "../../static/data"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { createProduct } from "../../redux/actions/product"
import { toast } from "react-toastify"

function CreateProduct() {
	const { seller } = useSelector((state) => state.seller)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [images, setImages] = useState([])
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [category, setCategory] = useState("")
	const [tags, setTags] = useState("")
	const [originalPrice, setOriginalPrice] = useState()
	const [discountPrice, setDiscountPrice] = useState()
	const [stock, setStock] = useState()

	const { isLoading, success, error } = useSelector((state) => state.product)

	useEffect(() => {
		if (error) {
			toast.error("Product Creation Declined")
		}

		if (success) {
			toast.success("Product Creation Successful")
			navigate("/dashboard-products")
			window.location.reload()
		}
	}, [dispatch, error, success])

	const handleSubmit = (e) => {
		e.preventDefault()
		const newForm = new FormData()

		images.forEach((image) => {
			newForm.append("images", image)
		})

		newForm.append("name", name)
		newForm.append("description", description)
		newForm.append("category", category)
		newForm.append("tags", tags)
		newForm.append("originalPrice", originalPrice)
		newForm.append("discountPrice", discountPrice)
		newForm.append("stock", stock)
		newForm.append("shopId", seller._id)

		dispatch(createProduct(newForm))
	}
	const handleImageChange = (e) => {
		e.preventDefault()

		let files = Array.from(e.target.files)

		setImages((prevImages) => [...prevImages, ...files])
	}

	return (
		<div className=" w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
			<h5 className=" text-[30px] font-Poppins text-center">Create Product</h5>
			{/* Create Product form */}
			<form onSubmit={handleSubmit}>
				<br />
				<div className="">
					<label htmlFor="name" className="pb-2">
						Name <span className=" text-red-500">*</span>
					</label>
					<input
						type="text"
						name="name"
						value={name}
						className="mt-2 appearance-none block w-full px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter the name of your product"
					/>
				</div>
				<br />

				<div className="">
					<label htmlFor="description" className="pb-2">
						Description <span className=" text-red-500">*</span>
					</label>
					<textarea
						cols={30}
						rows={8}
						type="text"
						name="description"
						value={description}
						className="mt-2 appearance-none block w-full pt-3 px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Product description"></textarea>
				</div>
				<br />

				<div className="">
					<label htmlFor="category" className="pb-2">
						Category <span className=" text-red-500">*</span>
					</label>
					<select
						name="category"
						id="category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className=" w-full mt-2 border h-[35px] rounded-[5px]">
						<option value="Choose a category">Choose a category</option>
						{categoriesData &&
							categoriesData.map((cat) => (
								<option value={cat.title} key={cat.title}>
									{cat.title}
								</option>
							))}
					</select>
				</div>
				<br />

				<div className="">
					<label htmlFor="tags" className="pb-2">
						Tags
					</label>
					<input
						type="text"
						name="tags"
						value={tags}
						className="mt-2 appearance-none block w-full px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
						onChange={(e) => setTags(e.target.value)}
						placeholder="Provide a hash tag"
					/>
				</div>
				<br />

				<div className="">
					<label htmlFor="originalPrice" className="pb-2">
						Original Price
					</label>
					<input
						type="numger"
						name="originalPrice"
						value={originalPrice}
						className="mt-2 appearance-none block w-full px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
						onChange={(e) => setOriginalPrice(e.target.value)}
						placeholder="Set Original price"
					/>
				</div>
				<br />

				<div className="">
					<label htmlFor="discountPrice" className="pb-2">
						Price (With Discount) <span className=" text-red-500">*</span>
					</label>
					<input
						type="number"
						name="discountPrice"
						value={discountPrice}
						className="mt-2 appearance-none block w-full px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
						onChange={(e) => setDiscountPrice(e.target.value)}
						placeholder="Set discount price"
					/>
				</div>
				<br />

				<div className="">
					<label htmlFor="stock" className="pb-2">
						Product Stock <span className=" text-red-500">*</span>
					</label>
					<input
						type="number"
						name="stock"
						value={stock}
						className="mt-2 appearance-none block w-full px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
						onChange={(e) => setStock(e.target.value)}
						placeholder="Set product stock"
					/>
				</div>
				<br />

				<div className="">
					<label htmlFor="images" className="pb-2">
						Product Images <span className=" text-red-500">*</span>
					</label>
					<input
						type="file"
						name="images"
						id="upload"
						className=" hidden"
						multiple
						onChange={handleImageChange}
					/>

					<label htmlFor="upload" className="">
						<AiOutlinePlusCircle className=" mt-3" size={30} color="#555" />
					</label>
					<div className="w-full flex items-center flex-wrap">
						{images &&
							images.map((image, i) => (
								<img
									key={i}
									src={URL.createObjectURL(image)}
									alt=""
									className=" h-[120px] w-[120px] object-cover m-2"
								/>
							))}
					</div>
				</div>
				<br />

				<div className="">
					<input
						type="submit"
						value="Create"
						className="mt-2 appearance-none block w-full px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
					/>
				</div>
			</form>
		</div>
	)
}

export default CreateProduct
