/* eslint-disable */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Checkout from '../components/Checkout'
import Rating from '../components/Rating'
import { useCartContext } from '../context/CartProvider'
import { useLoadingContext } from '../context/LoadingProvider'
import Modal from '../components/Modal'

const Cart = () => {
	const { cart, getUserCart } = useCartContext()
	const { loading, withLoading } = useLoadingContext()

	useEffect(() => {
		withLoading(() => getUserCart(), 'getUserCart')
	}, [])

	if (loading.getUserCart || !cart?.items)
		return <h1 className="text-4xl mt-16 text-center">جاري التحميل...</h1>
	else if (cart?.items && cart?.items?.length == 0) return <CartEmpty />

	return (
		<section className="container min-h-full-screen p-2">
			<h1 className="text-3xl font-bold border-b-2 p-2 flex items-center justify-center gap-2 text-gray-600 mt-12 w-fit mx-auto">
				السلة
				<span>({cart?.items?.length})</span>
			</h1>

			{/* cart items wrapper */}
			<div className="mt-8 flex flex-col items-stretch gap-3">
				{[...cart?.items].map(item => (
					<CartItem key={item._id} item={item} />
				))}
			</div>

			{/* check out button */}
			<Checkout />
		</section>
	)
}

export default Cart

function CartItem({ item }) {
	const { cart, updateProductQuantity, removeFromCart } = useCartContext()
	const [showProductNotes, setShowProductNotes] = useState(false)

	const handleIncreaseQuantity = () => {
		updateProductQuantity(cart?._id, item?.product?._id, 'increase', 1)
	}
	const handleDecreaseQuantity = () => {
		updateProductQuantity(cart?._id, item?.product?._id, 'decrease', 1)
	}
	const handleRemoveItemFromCart = () => {
		removeFromCart(cart?._id, item?.product?._id)
	}

	return (
		<div className="p-2 flex gap-2 bg-white shadow h-36">
			{/* image */}
			<div className="flex-1 inline-flex items-start">
				<img
					src={item.product.image?.url}
					alt=""
					className="max-w-full w-full h-full object-cover max-sm:min-w-[80px]"
				/>
			</div>
			{/* infos */}
			<div className="sm:flex-[5] max-sm:flex-[2] p-2 h-full">
				<h2 className="font-semibold text-lg mb-1">{item.product.name}</h2>
				<Rating rating={item.product.averageRating} />
				<div className="mt-5 text-sm">
					<p>{item.product.source}</p>
					<p>{item.product.category}</p>
				</div>
			</div>
			{/* Actions */}
			<div className="flex-[0.5] p-2 inline-flex flex-col justify-between">
				<div className="flex items-center gap-1 text-gray-800">
					<button className="material-icons-round text-lg" onClick={handleIncreaseQuantity}>
						add
					</button>
					<p className="text-gray-600 font-bold shadow rounded-full w-5 h-5 flex items-center justify-center">
						{item.quantity}
					</p>
					<button
						className="material-icons-round text-lg disabled:cursor-not-allowed disabled:text-gray-400"
						disabled={item.quantity == 1}
						onClick={handleDecreaseQuantity}
					>
						remove
					</button>
				</div>

				<div className="flex items-center gap-4 justify-end">
					{item?.productNotes && (
						<button className="material-icons-round text-xl text-cyan-600 animate-bounce" onClick={() => setShowProductNotes(true)}>
							description
						</button>
					)}

					<button
						className="material-icons-round text-red-400 text-xl"
						onClick={handleRemoveItemFromCart}
					>
						delete
					</button>
				</div>
			</div>

			<ProductNotesModal
				open={showProductNotes}
				setOpen={setShowProductNotes}
				notes={item?.productNotes}
			/>
		</div>
	)
}

export function ProductNotesModal({ open, setOpen, notes }) {
	return (
		<Modal open={open} setOpen={setOpen}>
			<div className="p-3 bg-gray-100 shadow-sm">
				{notes?.split(`\n`)?.map((line, i) => (
					<p key={i}>{line}</p>
				))}
			</div>
		</Modal>
	)
}

function CartEmpty() {
	return (
		<section className="container min-h-full-screen flex flex-col items-center">
			<h1 className="text-3xl font-bold mt-12 border-b-2 p-2">السلة</h1>
			<p className="mt-10 text-2xl flex items-center gap-3">
				<i className="material-icons-round text-red-500 text-[50px]">announcement</i>
				لا يوجد منتجات في السلة
			</p>
			<Link
				to={'/products'}
				className="bg-secondColor text-white hover:bg-cyan-700 py-2 px-3 rounded-sm mt-3 transition-all"
			>
				تصفح المنتجات
			</Link>
		</section>
	)
}
