/* eslint-disable */
import axios from 'axios'
import queryString from 'query-string'
import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useUserContext } from './UserProvider'

const ProductsContext = createContext(null)

const ProductsProvider = ({ children }) => {
	const { currentUser } = useUserContext()
	// states
	const [products, setProducts] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [productsCount, setProductsCount] = useState(0)
	const [currentProduct, setCurrentProduct] = useState({})
	const [showLeftSideBar, setShowLeftSideBar] = useState(false)

	// functions
	async function getProducts({ source, category, search }) {
		try {
			const params = { source, category, search }
			const queryParams = queryString.stringify(params)
			const { data } = await axios.get(`/api/products/?${queryParams}`, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			setProducts(data)
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function getProductsCount() {
		try {
			const { data } = await axios.get('/api/products/count', {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			setProductsCount(parseInt(data))
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function getCurrentProduct(id, callback) {
		try {
			const { data, status } = await axios.get(`/api/products/${id}`, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (status == 200) {
				setCurrentProduct(data)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function deleteProduct(productId) {
		try {
			const { data, status } = await axios.delete(`/api/products/${productId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				const all_products = [...products]
				const itemIndex = all_products.findIndex(pro => pro._id == data.productId)
				all_products.splice(itemIndex, 1)
				setProducts(all_products)
				toast.success(data.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function updateProductImage(productId, formData, callback) {
		try {
			const { data, status } = await axios.put(`/api/products/update-image/${productId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				setCurrentPage(data.product)
				toast.success(data.message)
				callback && callback()
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function updateProductDetails(productId, newInfos, callback) {
		try {
			const { data, status } = await axios.put(`/api/products/${productId}`, newInfos, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				setCurrentProduct(data.product)
				toast.success(data.message)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function createProduct(formData, callback) {
		try {
			const { data, status } = await axios.post(`/api/products`, formData, {
				headers: {
					'Content-Type': 'multipart/form',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 201) {
				toast.success(data.message)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	return (
		<ProductsContext.Provider
			value={{
				products,
				setProducts,
				getProducts,
				currentPage,
				setCurrentPage,
				getProductsCount,
				productsCount,
				getCurrentProduct,
				currentProduct,
				setCurrentProduct,
				deleteProduct,
				updateProductImage,
				updateProductDetails,
				createProduct,
				showLeftSideBar,
				setShowLeftSideBar,
			}}
		>
			{children}
		</ProductsContext.Provider>
	)
}

export default ProductsProvider

export const useProductsContext = () => {
	const {
		products,
		setProducts,
		getProducts,
		currentPage,
		setCurrentPage,
		getProductsCount,
		productsCount,
		getCurrentProduct,
		currentProduct,
		setCurrentProduct,
		deleteProduct,
		updateProductImage,
		updateProductDetails,
		createProduct,
		showLeftSideBar,
		setShowLeftSideBar,
	} = useContext(ProductsContext)
	return {
		products,
		setProducts,
		getProducts,
		currentPage,
		setCurrentPage,
		getProductsCount,
		productsCount,
		getCurrentProduct,
		currentProduct,
		setCurrentProduct,
		deleteProduct,
		updateProductImage,
		updateProductDetails,
		createProduct,
		showLeftSideBar,
		setShowLeftSideBar,
	}
}
