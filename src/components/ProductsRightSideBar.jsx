import { useState } from 'react'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'
import LoadingSpinner from "./LoadingSpinner"
import Pagination from "./Pagination"
import ProductItem from './ProductItem'

const ProductsRightSideBar = () => {
	const { products, currentPage, setCurrentPage } = useProductsContext()

	const PRODUCTS_PER_PAGE = 12
	const pagesCount = Math.ceil(products?.length / PRODUCTS_PER_PAGE)
	const lastIndex = currentPage * PRODUCTS_PER_PAGE
	const firstIndex = lastIndex - PRODUCTS_PER_PAGE
	const _products = [...products].slice(firstIndex, lastIndex)

	return (
		<div className="right-side-bar flex-1 flex flex-col gap-5">
			{/* search section */}
			<SearchForm />
			{products.length ? (
				<>
					{/* products wrapper */}
					<div className="flex-1 grid max-sm:grid-cols-1 max-md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
						{_products.map((product, index) => (
							// product item
							<ProductItem product={product} key={product._id} index={index} />
						))}
					</div>
					{/* products pagination */}
					<Pagination pagesCount={pagesCount} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
				</>
			) : (
				<div className="h-20">لا يوجد منتجات.</div>
			)}
		</div>
	)
}

const SearchForm = () => {
	const { getProducts, setCurrentPage, setShowLeftSideBar } = useProductsContext()
	const { withLoading, loading } = useLoadingContext()
	const [searchText, setSearchText] = useState('')


	const handleSearch = search => {
		setCurrentPage(1)
		withLoading(
			() =>
				getProducts({
					search,
				}),
			'productSearching',
		)
	}
	const handleClearSearch = () => {
		handleSearch('')
		setSearchText('')
	}

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				handleSearch(searchText)
			}}
			className="sticky top-[50px] p-4 z-[999] bg-white shadow bg-opacity-70 backdrop-blur-md"
		>
			<div className="flex items-stretch gap-3 max-lg:gap-1">
				<div className="flex-1 relative">
					<input
						type="text"
						placeholder="أبحث عن اسم منتجك او عبر التفاصيل..."
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						className="form-input transition-all duration-200 focus:pr-4 max-md:text-sm max-md:placeholder:text-[12px]"
					/>

					<button
						type="button"
						className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 transition-all"
						onClick={handleClearSearch}
					>
						backspace
					</button>
				</div>

				<button
					type="submit"
					className="bg-gradient-to-l from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all text-white flex items-center rounded-md gap-1 py-1 px-3"
				>
					{loading.productSearching ? (
						<LoadingSpinner />
					) : (
						<>
							<span className="max-md:hidden">أبحث</span>
							<i className="material-icons text-lg">search</i>
						</>
					)}
				</button>
				<button className="material-icons-round bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all text-white rounded-md gap-1 py-1 px-2 block lg:hidden" type="button" onClick={() => setShowLeftSideBar(p => !p)}>
					tune
				</button>
			</div>
		</form>
	)
}

export default ProductsRightSideBar
