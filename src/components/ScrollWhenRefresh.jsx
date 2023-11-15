/* eslint-disable */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollWhenRefresh = ({ children }) => {
	const { key, pathname } = useLocation()

	useEffect(() => {
		if (!pathname.includes('comments') && !pathname.includes('ratings')) {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		}
	}, [key])

	return children
}

export default ScrollWhenRefresh
