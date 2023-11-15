/* eslint-disable */
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useCommentsContext } from '../context/CommentsProvider'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'
import { useUserContext } from '../context/UserProvider'
import LoadingSpinner from './LoadingSpinner'
import Pagination from './Pagination'

export default function ProductComments() {
	return (
		<div className="max-w-3xl mx-auto">
			<AddComment />
			<CommentsList />
		</div>
	)
}

const AddComment = () => {
	const [comment, setComment] = useState('')
	const { withLoading, loading } = useLoadingContext()
	const { createComment } = useCommentsContext()
	const { currentUser } = useUserContext()
	const { currentProduct } = useProductsContext()

	const handleAddComment = e => {
		e.preventDefault()
		withLoading(() => createComment(currentUser?._id, currentProduct?._id, comment), 'createComment')
		setComment('')
	}
	
	if (!currentUser) {
		return <p>يجب عليك تسجيل الدخول لإضافة تعليق!</p>
	}
	return (
		<form onSubmit={handleAddComment}>
			<div className="flex items-stretch gap-3">
				<textarea
					type="text"
					placeholder="قم بإضافة تعليق..."
					className="form-input transition-all duration-200 focus:pr-4 resize-none !rounded-none"
					value={comment}
					onChange={e => setComment(e.target.value)}
				/>
				<div className="flex flex-col gap-1">
					<button
						type="submit"
						className="bg-gradient-to-l from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all text-white flex items-center rounded-md gap-1 py-1 px-3"
					>
						{loading.createComment ? <LoadingSpinner /> : 'تعليق'}
					</button>
					<button
						type="button"
						className="text-white bg-gradient-to-l from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all rounded-md py-1 px-3"
						onClick={() => setComment('')}
					>
						مسح
					</button>
				</div>
			</div>
		</form>
	)
}

const CommentsList = () => {
	const { currentProduct } = useProductsContext()
	const [currentPage, setCurrentPage] = useState(1)
	const COMMENTS_PER_PAGE = 5
	const commentsCount = currentProduct.comments?.length
	const pagesCount = Math.ceil(commentsCount / COMMENTS_PER_PAGE)
	const lastIndex = currentPage * COMMENTS_PER_PAGE
	const firstIndex = lastIndex - COMMENTS_PER_PAGE
	const _comments = currentProduct.comments?.slice(firstIndex, lastIndex)

	if (currentProduct?.comments?.length == 0) {
		return <p className="mt-3">لا يوجد تعليقات حتى الآن.</p>
	}

	return (
		<>
			{/* comments list */}
			<div className="my-5 flex flex-col items-stretch gap-3">
				{_comments?.map(comment => (
					// comment item
					<CommentItem comment={comment} key={comment?._id} />
				))}
			</div>
			{/* comments pagination */}
			<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount} />
		</>
	)
}

const CommentItem = ({ comment }) => {
	const { currentUser } = useUserContext()
	const { updateComment, deleteComment } = useCommentsContext()
	const [showUpdateComment, setShowUpdateComment] = useState(false)
	const [newText, setNewText] = useState('')

	const handleEditComment = e => {
		e.preventDefault()
		updateComment(comment?._id, newText)
		setShowUpdateComment(false)
	}

	const handleDeleteComment = () => {
		Swal.fire({
			title: 'هل أنت متأكد؟',
			text: 'لن تستطيع إعادة هذا التعليق!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--main-color)',
			cancelButtonText: 'إلغاء',
			confirmButtonText: 'نعم، متأكد!',
			iconColor: 'red',
			cancelButtonColor: 'var(--red-color)',
		}).then(result => {
			if (result.isConfirmed) {
				deleteComment(comment?._id)
			}
		})
	}

	return (
		<div key={comment?._id} className="py-2 px-4 shadow bg-white">
			{/* user info wrapper */}
			<div className="flex items-center gap-3 p-3">
				<img
					src="/images/defaultUser.png"
					alt="mock user image"
					className="w-10 h-10"
				/>
				{/* username and comment date */}
				<div>
					<p className="text-gray-700 text-sm">{comment?.user?.username}</p>
					<p className="text-[12px]">
						{new Intl.DateTimeFormat('ar', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
							weekday: 'long',
						}).format(new Date(comment?.createdAt))}
					</p>
				</div>
				{/* edit and delete buttons */}
				<div className="flex-1 flex items-center justify-end gap-2">
					{currentUser?._id == comment?.user?._id && (
						<i
							className="material-icons-round text-greenColor cursor-pointer"
							onClick={() => setShowUpdateComment(p => !p)}
						>
							{!showUpdateComment ? 'edit' : 'close'}
						</i>
					)}
					{(currentUser?.role == 'admin' ||
						currentUser?.role == 'employee' ||
						currentUser?._id == comment?.user?._id) && (
						<i
							className="material-icons-round text-redColor cursor-pointer"
							onClick={handleDeleteComment}
						>
							delete
						</i>
					)}
				</div>
			</div>
			{/* comment text and update text */}
			<div>
				{showUpdateComment ? (
					<form className="flex items-start gap-3" onSubmit={handleEditComment}>
						<textarea
							type="text"
							defaultValue={comment?.text}
							className="resize-none border border-gray-300 flex-[3] h-20 focus:ring-1 focus:ring-green-400 focus:rounded-md p-2 transition-all"
							onChange={e => setNewText(e.target.value)}
						/>
						<button type="submit" className="flex-1 bg-greenColor text-white py-2 ">
							تعديل
						</button>
					</form>
				) : (
					<p className="text-sm border-r-4 border-sky-500 p-2 bg-gray-100">
						{comment?.text?.split('\n')?.map((line, i) => (
							<span className="block" key={i}>
								{line}
							</span>
						))}
					</p>
				)}
			</div>
		</div>
	)
}
