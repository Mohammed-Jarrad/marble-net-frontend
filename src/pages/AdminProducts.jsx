/* eslint-disable */
import { motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'

const AdminProducts = () => {
	const { getProducts } = useProductsContext()
	const { loading, withLoading } = useLoadingContext()

	useEffect(() => {
		withLoading(() => getProducts({}), 'getProducts')
	}, [])

	const [currentPage, setCurrentPage] = useState(1)

	if (loading.getProducts) return <h1 className="text-3xl text-center mt-12">جاري التحميل...</h1>
	else if (loading.getProducts == undefined) return null
	return (
		<section>
			<div className="container mb-12">
				<Search setCurrentPage={setCurrentPage} />
				<ProductsTable setCurrentPage={setCurrentPage} currentPage={currentPage} />
			</div>
		</section>
	)
}

export default AdminProducts

function Search({ setCurrentPage }) {
	const [text, setText] = useState('')
	const { getProducts } = useProductsContext()
	const { withLoading, loading } = useLoadingContext()

	function handleSearch(e) {
		e.preventDefault()
		withLoading(() => getProducts({ search: text }), 'search')
		setCurrentPage(1)
	}

	return (
		<form className="mt-12" onSubmit={handleSearch}>
			<div className="flex items-center gap-3">
				<input
					type="text"
					placeholder="أبحث..."
					className="form-input flex-1"
					onChange={e => setText(e.target.value)}
				/>
				<button type="submit" className="custom-button bg-cyan-500 hover:bg-cyan-600">
					{loading.search ? <LoadingSpinner /> : 'أبحث'}
				</button>
			</div>
		</form>
	)
}

function ProductsTable({ setCurrentPage, currentPage }) {
	const { products } = useProductsContext()
	const RECORDS_PER_TABLE = 7
	const pagesCount = Math.ceil(products?.length / RECORDS_PER_TABLE)
	const lastIndex = currentPage * RECORDS_PER_TABLE
	const firstIndex = lastIndex - RECORDS_PER_TABLE
	const __products = products.slice(firstIndex, lastIndex)
	if (__products.length == 0) return <h1 className="text-center text-3xl mt-12">لا يوجد منتجات</h1>
	return (
		<>
			<div className="relative overflow-x-auto mt-7 w-full shadow-xl rounded mb-5">
				<table className="w-full text-right text-sm max-sm:text-[12px]">
					<thead className="bg-secondColor text-white">
						<tr>
							<th className="px-6 py-3">الرقم</th>
							<th className="px-6 py-3">الاسم</th>
							<th className="px-6 py-3">المصدر</th>
							<th className="px-6 py-3">الفئة</th>
							<th className="px-2 py-3">المزيد</th>
						</tr>
					</thead>
					<tbody>
						{[...__products].map((product, i) => (
							<Fragment key={i}>
								<ProductRecord product={product} i={i} />
							</Fragment>
						))}
					</tbody>
				</table>
			</div>

			<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount} />
		</>
	)
}

function ProductRecord({ product, i }) {
	const [showEdit, setShowEdit] = useState(false)

	const { withLoading, loading } = useLoadingContext()
	const { deleteProduct } = useProductsContext()

	const handleDeleteProduct = () => {
		Swal.fire({
			title: 'هل أنت متأكد؟',
			text: 'سيتم حذف هذا المنتج!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--main-color)',
			cancelButtonText: 'إلغاء',
			confirmButtonText: 'نعم، متأكد!',
			iconColor: 'red',
			cancelButtonColor: 'var(--red-color)',
		}).then(result => {
			if (result.isConfirmed) {
				withLoading(() => deleteProduct(product._id), 'deleteProduct')
			}
		})
	}

	return (
		<motion.tr
			initial={{ top: -200, opacity: 0 }}
			animate={{ top: 0, opacity: 1 }}
			transition={{ delay: 0.1 * i }}
			key={product?._id}
			className="relative bg-white border-b hover:bg-gray-50"
		>
			{/* number */}
			<th className="py-3 px-6">{i + 1}</th>
			{/* name */}
			<td className="py-3 px-6 whitespace-nowrap">{product?.name}</td>
			{/* source */}
			<td className="py-3 px-6 whitespace-nowrap">{product?.source}</td>
			{/* category */}
			<td className="py-3 px-6 whitespace-nowrap">{product?.category}</td>
			{/* more */}
			<td className="py-3 px-2 whitespace-nowrap">
				<div className="flex items-center gap-2">
					<button className="custom-button" onClick={() => handleDeleteProduct()}>
						{loading.deleteProduct ? (
							<LoadingSpinner />
						) : (
							<i className="material-icons-round text-xl text-red-500 hover:text-red-600">delete</i>
						)}
					</button>
					<Link className="custom-button" to={`/dashboard/update-product/${product._id}`}>
						<i className="material-icons-round text-xl text-green-500 hover:text-green-600">edit</i>
					</Link>
				</div>
			</td>
		</motion.tr>
	)
}
