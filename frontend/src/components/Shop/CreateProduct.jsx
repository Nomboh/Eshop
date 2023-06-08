import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { categoriesData } from "../../static/data"

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

	const handleSubmit = (e) => {
		e.preventDefault()
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
					<input
						type="text"
						name="description"
						value={description}
						className="mt-2 appearance-none block w-full px-3 h-[35px] border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Product description"
					/>
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
			</form>
		</div>
	)
}

export default CreateProduct
