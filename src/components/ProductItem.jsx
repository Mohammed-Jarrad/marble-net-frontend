import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Rating from "./Rating"

/* eslint-disable */
const ProductItem = ({ product , index}) => {
	return (
		<motion.div
			initial={{ right: -100, top: -100, opacity: 0 }}
			animate={{ right: 0, top: 0, opacity: 1 }}
			transition={{delay: index * 0.1}}
			className="relative shadow-2xl flex flex-col"
		>
			{/* product image */}
			<Link to={`/products/${product?._id}`}>
				<img
					src={product?.image.url}
					alt={product?.name}
					className="max-w-full w-full h-[300px] object-cover rounded-tl-md rounded-tr-md"
				/>
			</Link>

			<div className="flex-1 flex flex-col justify-between">
				{/* content */}
				<div className="py-5 px-3 text-[#555]">
					{/* Name + Category */}
					<div className="flex items-center justify-between">
						<h2 className="font-bold">{product.name}</h2>
						<p className="text-sm border border-redColor py-[2px] px-3 rounded-lg">
							{product?.category}
						</p>
					</div>
					{/* Source */}
					<div className="flex items-center justify-between font-semibold text-sm mt-2 pl-3">
						<p>المصدر:</p>
						<p>{product?.source}</p>
					</div>
					{/* Average Ratings */}
					{product?.averageRating > 0 && (
						<div className="flex items-center gap-3 mt-2">
							<Rating rating={product?.averageRating} />
							<p>({product?.ratings?.length})</p>
						</div>
					)}
				</div>
				{/* Add to Cart Button */}
				<Link
					to={`/products/${product?._id}`}
					className="bg-gradient-to-r from-sky-600 to-sky-700 w-full text-white flex items-center justify-center gap-2 py-2 rounded-bl-md rounded-br-md"
				>
					أضف الى السلة
					<span className="material-icons-round">add_shopping_cart</span>
				</Link>
			</div>
		</motion.div>
	)
}

export default ProductItem
