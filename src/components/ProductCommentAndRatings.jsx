/* eslint-disable */
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useProductsContext } from "../context/ProductsProvider"

const ProductCommentAndRatings = ({ id }) => {
	const { pathname: path } = useLocation()
	const { currentProduct } = useProductsContext()
	return (
		<div className="container my-20 max-w-3xl">
			<div className="flex items-center gap-4 border-b-2 border-gray-300 mb-8">
				<Link
					to={`/products/${id}/comments`}
					className={`p-2 font-semibold text-gray-500 transition-all ${
						(path == `/products/${id}/comments` || path == `/products/${id}`) && 'border-r-4 border-sky-700 text-gray-900'
					}`}
				>
					التعليقات ({currentProduct?.comments?.length})
				</Link>
				<Link
					to={`/products/${id}/ratings`}
					className={`p-2 font-semibold text-gray-500 transition-all ${path == `/products/${id}/ratings` && 'border-r-4 border-sky-700 text-gray-900'}`}
				>
					التقييمات ({currentProduct?.ratings?.length})
				</Link>
			</div>

			<Outlet />
		</div>
	)
}

export default ProductCommentAndRatings
