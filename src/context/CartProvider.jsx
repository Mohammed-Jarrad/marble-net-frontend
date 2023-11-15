/* eslint-disable */
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './UserProvider'
import axios from 'axios'
import { useProductsContext } from './ProductsProvider'
import toast, { Toaster } from 'react-hot-toast'

const CartContext = createContext(null)

const CartProvider = ({ children }) => {
	const { currentUser } = useUserContext()
	const [cart, setCart] = useState({})

	async function addToCart(cartId, productId, quantity, productNotes, callback) {
		try {
			const newCartItem = {
				cartId,
				product: productId,
				quantity,
				productNotes: productNotes ? productNotes : null,
			}
			const { data, status } = await axios.put(`/api/carts/add`, newCartItem, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				toast.success(data.message)
				setCart(data.cart)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function getUserCart() {
		try {
			const { data } = await axios.get(`/api/carts/user/${currentUser?._id}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			setCart(data)
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function removeFromCart(cartId, productId) {
		try {
			const { data, status } = await axios.put(
				`/api/carts/remove`,
				{ cartId, product: productId },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + currentUser?.token,
					},
				},
			)
			if (status == 200) {
				setCart(data.cart)
				toast.success(data.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function updateProductQuantity(cartId, productId, type, quantity) {
		try {
			const { data, status } = await axios.put(
				`/api/carts/inc-dec-quantity`,
				{ cartId, product: productId, type, quantity },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + currentUser?.token,
					},
				},
			)
			if (status == 200) {
				setCart(data.cart)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	return (
		<CartContext.Provider
			value={{ addToCart, cart, setCart, getUserCart, removeFromCart, updateProductQuantity }}
		>
			{children}
		</CartContext.Provider>
	)
}

export default CartProvider

export const useCartContext = () => {
	const { addToCart, cart, setCart, getUserCart, removeFromCart, updateProductQuantity } =
		useContext(CartContext)
	return { addToCart, cart, setCart, getUserCart, removeFromCart, updateProductQuantity }
}
