/* eslint-disable */

import { useState } from 'react'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'
import { InputBox } from './AdminUpdateProduct'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminCreateProduct = () => {
	const { withLoading, loading } = useLoadingContext()
	const { createProduct } = useProductsContext()

	const [file, setFile] = useState(null)
	const [name, setName] = useState('')
	const [source, setSource] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')

	function handleCreateProduct(e) {
		e.preventDefault()
		const formData = new FormData()
		formData.append('image', file)
		formData.append('name', name)
		formData.append('source', source)
		formData.append('category', category)
		formData.append('description', description)
		withLoading(
			() =>
				createProduct(formData, data => {
					console.log(data)
				}),
			'createProduct',
		)
	}

	return (
		<section>
			<div className="container my-12">
				<form
					className="flex flex-col md:flex-row-reverse  justify-center md:justify-between gap-6 md:gap-8"
					onSubmit={handleCreateProduct}
				>
					{/* update product image form. */}
					<div className="flex flex-col items-center md:flex-1">
						<div className="relative text-center">
							<img
								src={file ? URL.createObjectURL(file) : '/images/defaultProduct.png'}
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
					</div>

					{/* update product details form. */}
					<div className="md:flex-1 md:max-w-lg flex flex-col gap-3">
						<InputBox
							id="name"
							onChange={e => setName(e.target.value)}
							placeholder="أضف الاسم الجديد..."
							title={'الاسم'}
							type={'text'}
							value={name}
							required={true}
						/>
						<InputBox
							id="source"
							onChange={e => setSource(e.target.value)}
							placeholder="أضف المصدر الجديد..."
							title={'المصدر'}
							type={'text'}
							value={source}
							required={true}
						/>
						<div className="flex flex-col items-start gap-2">
							<label htmlFor={'category'} className="font-medium">
								الفئة
							</label>
							<select
								id="category"
								required
								value={category}
								onChange={e => setCategory(e.target.value)}
								className="w-full form-input"
							>
								<option value="" disabled>
									اختار الفئة
								</option>
								<option value="طبيعي">طبيعي</option>
								<option value="صناعي">صناعي</option>
							</select>
						</div>
						<InputBox
							id="description"
							onChange={e => setDescription(e.target.value)}
							placeholder="أضف الوصف الجديد..."
							title={'الوصف'}
							type={'text'}
							value={description}
							textarea={true}
							required={true}
						/>
						<button type="submit" className="custom-button bg-cyan-500 hover:bg-cyan-600">
							{loading.createProduct ? <LoadingSpinner /> : 'إنشاء المنتج'}
						</button>
					</div>
				</form>
			</div>
		</section>
	)
}

export default AdminCreateProduct
