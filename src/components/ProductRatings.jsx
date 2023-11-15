/* eslint-disable */
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'
import { useRatingsContext } from '../context/RatingProvider'
import { useUserContext } from '../context/UserProvider'
import LoadingSpinner from './LoadingSpinner'
import Pagination from './Pagination'
import Rating from './Rating'

export default function ProductRatings() {
	return (
		<div className="max-w-3xl mx-auto">
			<AddRate />
			<RatingsList />
		</div>
	)
}

function AddRate() {
	const { currentUser } = useUserContext()
	const { currentProduct } = useProductsContext()
	const { withLoading, loading } = useLoadingContext()
	const { addRate } = useRatingsContext()
	const [rate, setRate] = useState(0)
	const [hoveredRate, setHoveredRate] = useState(0)

	const handleAddRate = () => {
		withLoading(() => addRate(currentUser?._id, currentProduct?._id, rate), 'addRate')
	}

	if (!currentUser) return <p>يجب عليك تسجيل الدخول لإضافة تقييم!</p>
	return (
		<div>
			<p className="text-center">قم بإضافة تقييمك</p>
			<div className="flex items-center justify-center mt-3">
				{[1, 2, 3, 4, 5].map(star => (
					<i
						className={`material-icons-round text-3xl cursor-pointer ${
							star <= (hoveredRate || rate) ? 'text-yellow-500' : 'text-gray-300'
						}`}
						key={star}
						onMouseEnter={() => setHoveredRate(star)}
						onMouseLeave={() => setHoveredRate(0)}
						onClick={() => setRate(star)}
					>
						{star <= (hoveredRate || rate) ? 'star' : 'star_border'}
					</i>
				))}
			</div>
			{rate > 0 && (
				<div className="flex items-center gap-2 justify-center mt-2">
					<button
						className="bg-gradient-to-l from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all text-white flex items-center rounded-md gap-1 py-1 px-3"
						onClick={handleAddRate}
					>
						{loading.addRate ? <LoadingSpinner /> : 'إضافة'}
					</button>
					<button
						type="button"
						className="text-white bg-gradient-to-l from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all rounded-md py-1 px-3"
						onClick={() => setRate(0)}
					>
						مسح
					</button>
				</div>
			)}
		</div>
	)
}

function RatingsList() {
	const { currentProduct } = useProductsContext()
	const [currentPage, setCurrentPage] = useState(1)
	const RATINGS_PER_PAGE = 5
	const ratingsCount = currentProduct?.ratings?.length
	const pagesCount = Math.ceil(ratingsCount / RATINGS_PER_PAGE)
	const lastIndex = currentPage * RATINGS_PER_PAGE
	const firstIndex = lastIndex - RATINGS_PER_PAGE
	const ratings = currentProduct?.ratings?.slice(firstIndex, lastIndex)

	if (currentProduct?.ratings?.length == 0) {
		return <p className="mt-3">لا يوجد تقييمات حتى الآن.</p>
	}

	return (
		<>
			{/* ratings list */}
			<div className="my-5 flex flex-col items-stretch gap-3">
				{ratings?.map(rate => (
					// rate item
					<RatingItem rate={rate} key={rate?._id} />
				))}
			</div>
			{/* comments pagination */}
			<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount} />
		</>
	)
}

function RatingItem({ rate }) {
	const { currentUser } = useUserContext()
	const { deleteRate } = useRatingsContext()

	const handleDeleteRate = () => {
		Swal.fire({
			title: 'هل أنت متأكد؟',
			text: 'سيتم حذف هذا التقييم!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--main-color)',
			cancelButtonText: 'إلغاء',
			confirmButtonText: 'نعم، متأكد!',
			iconColor: 'red',
			cancelButtonColor: 'var(--red-color)',
		}).then(result => {
			if (result.isConfirmed) {
				deleteRate(rate?._id)
			}
		})
	}

	return (
		<div className="p-2 shadow">
			<div className="flex items-center gap-3 p-3">
				<img
					src="/images/defaultUser.png"
					alt="mock user image"
					className="w-10 h-10"
				/>
				{/* username and rate date */}
				<div>
					<p className="text-gray-700 text-sm">{rate?.user?.username}</p>
					<p className="text-[12px]">
						{new Intl.DateTimeFormat('ar', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
							weekday: 'long',
						}).format(new Date(rate?.createdAt))}
					</p>
				</div>
				{/* delete buttons */}
				<div className="flex-1 text-left">
					{currentUser?._id == rate?.user?._id && (
						<i className="material-icons-round text-redColor cursor-pointer" onClick={handleDeleteRate}>
							delete
						</i>
					)}
				</div>
			</div>
			<div className="py-2 px-4">
				<Rating rating={rate?.value} />
			</div>
		</div>
	)
}
