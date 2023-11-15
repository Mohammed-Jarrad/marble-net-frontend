/* eslint-disable */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import ProductCommentAndRatings from '../components/ProductCommentAndRatings'
import Rating from '../components/Rating'
import { useCartContext } from '../context/CartProvider'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'
import { useUserContext } from '../context/UserProvider'

const Product = () => {
	const { id } = useParams()
	const { withLoading, loading } = useLoadingContext()
	const { getCurrentProduct, currentProduct } = useProductsContext()
	const { cart } = useCartContext()
	const [quantity, setQuantity] = useState(1)
	const { addToCart } = useCartContext()
	const { currentUser } = useUserContext()
	const [showNotes, setShowNotes] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		withLoading(() => getCurrentProduct(id), 'getCurrentProduct')
	}, [])

	const handleAddItemToCart = () => {
		if (!currentUser) {
			navigate('/login')
			return toast.error('يجب عليك تسجيل الدخول لاتمام عملية الاضافة الى السلة.', {
				duration: '200',
				position: 'bottom-center',
			})
		}
		if (cart && [...cart.items].find(item => item.product._id == id)) {
			withLoading(() => addToCart(currentUser?.cart, id, quantity), 'addItemToCart')
		} else {
			setShowNotes(true)
		}
	}

	if (loading.getCurrentProduct) {
		return (
			<section className="min-h-full-screen flex items-center justify-center">
				<div className="flex items-center justify-center gap-4 mx-auto mt-20">
					<p className="text-3xl">جاري التحميل</p>
					<p className="h-20 w-20 rounded-full border-t-8 animate-spin border-sky-400"></p>
				</div>
			</section>
		)
	}

	return (
		<section className="min-h-full-screen">
			{/* product details section */}
			<div className="container flex justify-center gap-6 px-6 py-12 max-md:flex-col">
				{/* image section */}
				<div className="flex-1">
					<img
						src={currentProduct?.image?.url}
						alt={currentProduct.name}
						className="max-w-full shadow"
					/>
				</div>
				{/* infos section */}
				<div className="flex-1 p-3">
					<h1 className="text-3xl font-bold text-[#333] mb-3">{currentProduct?.name}</h1>
					<Rating rating={currentProduct?.averageRating} />
					<div className="mt-5">
						{currentProduct?.description?.split('\n').map((line, ind) => (
							<p key={ind} className="text-gray-500">
								{line}
							</p>
						))}
					</div>
					{/* add to cart section */}
					<div className="flex items-end justify-start mt-10 gap-2">
						<div className="flex-1">
							<p className="mb-1">الكمية</p>
							<select
								className="border border-gray-400 bg-transparent text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none  block w-full py-1 px-3"
								value={quantity}
								onChange={e => setQuantity(parseInt(e.target.value))}
							>
								{Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
									<option key={num} value={num}>
										{num}
									</option>
								))}
							</select>
						</div>
						<button
							className="flex-[3] bg-gradient-to-r from-sky-500 to-sky-800 w-full text-white gap-2 py-2"
							onClick={handleAddItemToCart}
						>
							{loading.addItemToCart ? <LoadingSpinner /> : 'أضف الى السلة'}
						</button>
					</div>
				</div>
			</div>
			<NotesModal open={showNotes} setOpen={setShowNotes} quantity={quantity} />
			{/* product comments and ratings section */}
			<ProductCommentAndRatings id={id} />
		</section>
	)
}

export default Product

const NotesModal = ({ open, setOpen, quantity }) => {
	const { currentUser } = useUserContext()
	const { currentProduct } = useProductsContext()
	const { withLoading, loading } = useLoadingContext()
	const { addToCart } = useCartContext()
	const [productNotes, setProductNotes] = useState('')

	const handleAddToCart = e => {
		e.preventDefault()
		withLoading(
			() =>
				addToCart(currentUser?.cart, currentProduct._id, quantity, productNotes, () => {
					setOpen(false)
				}),
			'addItemToCart',
		)
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<form onSubmit={handleAddToCart}>
				<label htmlFor="productNotes" className="block mb-3">
					ملاحظات المنتج
				</label>
				<textarea
					id="productNotes"
					cols="30"
					rows="10"
					className="form-input resize-none"
					placeholder="ادخل الملاحظات التي تريدها على هذا المنتج..."
					value={productNotes}
					onChange={e => setProductNotes(e.target.value)}
				/>
				<button className="custom-button bg-secondColor hover:bg-cyan-700 mt-4 w-full" type="submit">
					{loading.addItemToCart ? <LoadingSpinner /> : 'انشاء الطلب'}
				</button>
			</form>
		</Modal>
	)
}
