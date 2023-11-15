/* eslint-disable */
import { createContext, useContext } from 'react'
import { useUserContext } from './UserProvider'
import axios from 'axios'
import { useProductsContext } from './ProductsProvider'
import toast from 'react-hot-toast'

const CommentsContext = createContext(null)

const CommentsProvider = ({ children }) => {
	const { currentUser } = useUserContext()
	const { setCurrentProduct, currentProduct } = useProductsContext()

	async function createComment(userId, productId, text) {
		const _comment = {
			user: userId,
			product: productId,
			text,
		}
		try {
			const { status, data } = await axios.post('/api/comments', _comment, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status === 201) {
				// add new comment to currentProduct comments
				setCurrentProduct(prev => ({ ...prev, comments: [...prev.comments, data] }))
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function updateComment(commentId, text) {
		try {
			const { data, status } = await axios.put(
				`/api/comments/${commentId}`,
				{ text },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + currentUser?.token,
					},
				},
			)
			if (status == 200) {
				// update the comment in currentProduct comments
				const comments = [...currentProduct.comments]
				const itemIndex = comments.findIndex(item => item._id == commentId)
				comments[itemIndex] = data
				setCurrentProduct(prev => ({ ...prev, comments }))
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function deleteComment(commentId) {
		try {
			const { data, status } = await axios.delete(`/api/comments/${commentId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				// delete item from currentProduct comments
				const comments = [...currentProduct.comments]
				const itemIndex = comments.findIndex(item => item._id == commentId)
				comments.splice(itemIndex, 1)
				setCurrentProduct(prev => ({ ...prev, comments }))
				toast.success(data.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	// async function

	return (
		<CommentsContext.Provider
			value={{
				createComment,
				updateComment,
				deleteComment,
			}}
		>
			{children}
		</CommentsContext.Provider>
	)
}

export default CommentsProvider

export const useCommentsContext = () => {
	const { createComment, updateComment, deleteComment } = useContext(CommentsContext)
	return { createComment, updateComment, deleteComment }
}
