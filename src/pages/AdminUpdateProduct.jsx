/* eslint-disable */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'
import Rating from '../components/Rating'

const AdminUpdateProduct = () => {
	const { id } = useParams()
	const { withLoading, loading } = useLoadingContext()
	const { currentProduct, getCurrentProduct, updateProductImage, updateProductDetails } =
		useProductsContext()

	const [file, setFile] = useState(null)
	const [name, setName] = useState('')
	const [source, setSource] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')

	useEffect(() => {
		withLoading(
			() =>
				getCurrentProduct(id, data => {
					setCategory(data.category)
					setSource(data.source)
					setDescription(data.description)
					setName(data.name)
				}),
			'getCurrentProduct',
		)
	}, [id])

	function handleImageUpload(e) {
		e.preventDefault()
		const formData = new FormData()
		formData.append('image', file)
		if (!file) return toast.error(`الرجاء إضافة صورة`)
		withLoading(
			() =>
				updateProductImage(id, formData, () => {
					setFile(null)
				}),
			'updateProductImage',
		)
	}

	function handleUpdateProductDetails(e) {
		e.preventDefault()
		const newInfos = { name, source, description, category }
		withLoading(() => updateProductDetails(id, newInfos), 'updateProductDetails')
	}

	if (loading.getCurrentProduct) return <h1 className="text-3xl text-center mt-12">جاري التحميل...</h1>
	else if (loading.getCurrentProduct == undefined) return null

	return (
		<section>
			<div className="container my-12">
				<div className="flex flex-col md:flex-row-reverse  justify-center md:justify-between gap-6 md:gap-8">
					{/* update product image form. */}
					<form className="flex flex-col items-center md:flex-1" onSubmit={handleImageUpload}>
						<div className="relative text-center">
							<img
								src={file ? URL.createObjectURL(file) : currentProduct?.image?.url}
								alt="preview"
								className="max-w-full w-56 h-56 object-cover rounded mx-auto shadow-sm"
							/>
							<input
								type="file"
								id="file"
								onChange={e => setFile(e.target.files[0])}
								className="hidden"
							/>
							<label htmlFor="file">
								<i className="material-icons-round w-8 h-8 bg-red-500 flex items-center justify-center mx-auto rounded-full text-white text-lg absolute -bottom-3 left-1/2 -translate-x-1/2 cursor-pointer">
									photo_camera
								</i>
							</label>
						</div>
						<button type="submit" className="custom-button bg-cyan-500 hover:bg-cyan-600 mt-6 mb-4">
							{loading.updateProductImage ? <LoadingSpinner /> : 'تعديل الصورة'}
						</button>
						<Rating rating={currentProduct?.averageRating} />
                        <p className="text-gray-500 mt-2">({currentProduct?.ratings?.length}) تقييمات</p>
                        <p className="text-gray-500 mt-2">({currentProduct?.comments?.length}) تعليقات</p>
					</form>

					{/* update product details form. */}
					<form
						onSubmit={handleUpdateProductDetails}
						className="md:flex-1 md:max-w-lg flex flex-col gap-3"
					>
						<InputBox
							id="name"
							onChange={e => setName(e.target.value)}
							placeholder="أضف الاسم الجديد..."
							title={'الاسم'}
							type={'text'}
							value={name}
						/>
						<InputBox
							id="source"
							onChange={e => setSource(e.target.value)}
							placeholder="أضف المصدر الجديد..."
							title={'المصدر'}
							type={'text'}
							value={source}
						/>
						<InputBox
							id="category"
							onChange={e => setCategory(e.target.value)}
							placeholder="أضف الفئة الجديدة..."
							title={'الفئة'}
							type={'text'}
							value={category}
						/>
						<InputBox
							id="description"
							onChange={e => setDescription(e.target.value)}
							placeholder="أضف الوصف الجديد..."
							title={'الوصف'}
							type={'text'}
							value={description}
							textarea={true}
						/>
						<button type="submit" className="custom-button bg-cyan-500 hover:bg-cyan-600">
							{loading.updateProductDetails ? <LoadingSpinner /> : 'حفظ التعديلات'}
						</button>
					</form>
				</div>
			</div>
		</section>
	)
}

export default AdminUpdateProduct

export const InputBox = ({ id, title, type, placeholder, value, onChange, textarea }) => {
	return (
		<div className="flex flex-col items-start gap-2">
			<label htmlFor={id} className="font-medium">
				{title}
			</label>
			{textarea ? (
				<textarea
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className="form-input md:max-w-lg resize-none"
					rows={7}
				/>
			) : (
				<input
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className="form-input md:max-w-lg"
				/>
			)}
		</div>
	)
}
