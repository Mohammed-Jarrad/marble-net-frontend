/* eslint-disable */
import { createContext, useContext, useState } from 'react'

const LoadingContext = createContext(null)

const LoadingProvider = ({ children }) => {
	const [loading, setLoading] = useState({})

	const withLoading = async (callback, key) => {
		setLoading(prev => ({ ...prev, [key]: true }))
		try {
			await callback()
		} finally {
			setLoading(prev => ({ ...prev, [key]: false }))
		}
	}

	return (
		<LoadingContext.Provider value={{ loading, withLoading, setLoading }}>
			{children}
		</LoadingContext.Provider>
	)
}

export default LoadingProvider

export const useLoadingContext = () => {
	const { loading, setLoading, withLoading } = useContext(LoadingContext)
	return { loading, setLoading, withLoading }
}
