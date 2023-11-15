/* eslint-disable */
import axios from 'axios'
import queryString from 'query-string'
import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useCartContext } from './CartProvider'
import { useUserContext } from './UserProvider'

const OrderContext = createContext(null)

const OrderProvider = ({ children }) => {
	const { currentUser } = useUserContext()
	const { setCart } = useCartContext()
	const [ordersForUser, setOrdersForUser] = useState([])
	const [currentOrder, setCurrentOrder] = useState({})
	const [allOrders, setAllOrders] = useState([])

	async function createOrder(order, callback) {
		try {
			const { data, status } = await axios.post('/api/orders', order, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 201) {
				setCart(data.cart)
				toast.success(data.message)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}
	async function getOrdersForUser({ status }) {
		try {
			const params = { status }
			const queryParams = queryString.stringify(params)
			const { data, status: s } = await axios.get(
				`/api/orders/user/${currentUser?._id}?${queryParams}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + currentUser?.token,
					},
				},
			)
			if (s == 200) {
				setOrdersForUser(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}
	async function getAllOrders({ status }) {
		try {
			const params = { status }
			const queryParams = queryString.stringify(params)
			const { data, status: s } = await axios.get(`/api/orders?${queryParams}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (s == 200) {
				setAllOrders(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}
	async function getCurrentOrder(orderId) {
		try {
			const { data, status } = await axios.get(`/api/orders/${orderId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				setCurrentOrder(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}
	async function updateOrderNotes(notes, orderId, callback) {
		try {
			const { data, status } = await axios.put(
				`/api/orders/update-note/${orderId}`,
				{ notes },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + currentUser?.token,
					},
				},
			)
			if (status == 200) {
				setCurrentOrder(data)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}
	async function updateOrderStatus(status, orderId, callback) {
		try {
			const { data, status: s } = await axios.put(
				`/api/orders/update-status/${orderId}`,
				{ status },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + currentUser?.token,
					},
				},
			)
			if (s == 200) {
				setCurrentOrder(data)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}
	async function deleteOrder(orderId, callback) {
		try {
			const { data, status } = await axios.delete(`/api/orders/${orderId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				setAllOrders(prev => prev.filter(item => item._id !== orderId))
				toast.success(data.message)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	return (
		<OrderContext.Provider
			value={{
				ordersForUser,
				getOrdersForUser,
				currentOrder,
				setOrdersForUser,
				setCurrentOrder,
				createOrder,
				getAllOrders,
				allOrders,
				setAllOrders,
				getCurrentOrder,
				updateOrderStatus,
				updateOrderNotes,
				deleteOrder,
			}}
		>
			{children}
		</OrderContext.Provider>
	)
}

export default OrderProvider

export const useOrderContext = () => {
	const {
		ordersForUser,
		getOrdersForUser,
		currentOrder,
		setOrdersForUser,
		setCurrentOrder,
		createOrder,
		getAllOrders,
		allOrders,
		setAllOrders,
		getCurrentOrder,
		updateOrderStatus,
		updateOrderNotes,
		deleteOrder,
	} = useContext(OrderContext)
	return {
		ordersForUser,
		getOrdersForUser,
		currentOrder,
		setOrdersForUser,
		setCurrentOrder,
		createOrder,
		getAllOrders,
		allOrders,
		setAllOrders,
		getCurrentOrder,
		updateOrderStatus,
		updateOrderNotes,
		deleteOrder,
	}
}
