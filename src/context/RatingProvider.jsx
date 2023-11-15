/* eslint-disable */
import axios from 'axios'
import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'
import { useProductsContext } from './ProductsProvider'
import { useUserContext } from './UserProvider'

const RatingContext = createContext(null)

const RatingProvider = ({ children }) => {
	const { currentUser } = useUserContext()
	const { setCurrentProduct, currentProduct } = useProductsContext()

	async function addRate(userId, productId, value) {
		const _rate = {
			user: userId,
			product: productId,
			value,
		}
		try {
			const { data, status } = await axios.post(`/api/ratings/`, _rate, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			// if the rate exist already
			if (status == 200) {
				// update item in the ratings
				const ratings = [...currentProduct.ratings]
				const itemIndex = ratings.findIndex(item => item._id == data?.rate?._id)
				ratings[itemIndex] = data?.rate
				const averageRating = ratings.reduce((total, rate) => total + rate.value, 0) / ratings.length
				setCurrentProduct(prev => ({ ...prev, ratings, averageRating }))
			} else if (status == 201) {
				// add item in the ratings
				const newRatings = [...currentProduct.ratings, data.rate]
				const averageRating =
					newRatings.reduce((total, rate) => total + rate.value, 0) / newRatings.length
				setCurrentProduct(prev => ({ ...prev, ratings: newRatings, averageRating }))
			}
			toast.success(data.message)
		} catch (error) {
			toast.error(error.response.data.message)
			console.log(error)
		}
	}

	async function deleteRate(rateId) {
		try {
			const { data, status } = await axios.delete(`/api/ratings/${rateId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				const ratings = [...currentProduct.ratings]
				const itemIndex = ratings.findIndex(item => item._id == rateId)
				ratings.splice(itemIndex, 1)
				const averageRating = ratings.length
					? ratings.reduce((total, rate) => total + rate.value, 0) / ratings?.length
					: 0
				setCurrentProduct(prev => ({ ...prev, ratings, averageRating }))
			}
			toast.success(data.message)
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	return (
		<RatingContext.Provider
			value={{
				addRate,deleteRate
			}}
		>
			{children}
		</RatingContext.Provider>
	)
}

export default RatingProvider

export const useRatingsContext = () => {
	const { addRate,deleteRate } = useContext(RatingContext)
	return { addRate,deleteRate }
}
