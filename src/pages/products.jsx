/* eslint-disable */
import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductsLeftSideBar from '../components/ProductsLeftSideBar'
import ProductsRightSideBar from '../components/ProductsRightSideBar'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'

const Products = () => {
	const { getProducts } = useProductsContext()
	const { loading, withLoading } = useLoadingContext()

	useEffect(() => {
		withLoading(() => getProducts({}), 'getProducts1')
	}, [])

	if (loading.getProducts1)
		return (
			<div className="flex items-center justify-center gap-4 mx-auto mt-20">
				<p className="text-3xl">جاري التحميل</p>
				<p className="h-20 w-20 rounded-full border-t-8 animate-spin border-sky-400"></p>
			</div>
		)
	else if (loading.getProducts1 == undefined) return null
	return (
		<section className="p-5 pr-7 flex gap-5 max-w-[1500px] mx-auto relative min-h-full-screen">
			<ProductsRightSideBar />
			<ProductsLeftSideBar />
		</section>
	)
}

export default Products
