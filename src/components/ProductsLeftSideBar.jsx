/* eslint-disable */

import { motion } from 'framer-motion'
import MultiRangeSlider from 'multi-range-slider-react'
import { useState } from 'react'
import { useLoadingContext } from '../context/LoadingProvider'
import { useProductsContext } from '../context/ProductsProvider'
import LoadingSpinner from './LoadingSpinner'

const ProductsLeftSideBar = () => {
	const { products, getProducts, setCurrentPage, showLeftSideBar, setShowLeftSideBar } =
		useProductsContext()
	const { withLoading, loading } = useLoadingContext()

	const [sources] = useState([...new Set([...products].map(p => p.source))])
	const [categories] = useState([...new Set([...products].map(p => p.category))])

	const [selectedSources, setSelectedSources] = useState([])
	const [selectedCategories, setSelectedCategories] = useState([])

	const handleChangeSources = e => {
		const value = e.target.value
		if (e.target.checked) setSelectedSources(p => [...p, value])
		else setSelectedSources(p => p.filter(source => source != value))
	}
	const handleChangeCategories = e => {
		const value = e.target.value
		if (e.target.checked) setSelectedCategories(p => [...p, value])
		else setSelectedCategories(p => p.filter(source => source != value))
	}
	const handleFilterProducts = () => {
		let params = {}
		if (selectedSources.length > 0) params.source = selectedSources.join(', ')
		if (selectedCategories.length > 0) params.category = selectedCategories.join(', ')
		setCurrentPage(1)
		withLoading(() => getProducts(params), 'filterProducts')
		setShowLeftSideBar(false)
	}

	return (
		<>
			{/* overlay */}
			<div
				className={`fixed inset-0 bg-black/25 z-[999] transition-all ${
					!showLeftSideBar && 'opacity-0 pointer-events-none'
				}`}
				onClick={() => setShowLeftSideBar(false)}
			></div>

			<div
				style={{ maxHeight: 'calc(100vh - 80px)' }}
				className={`h-fit sticky top-[60px] overflow-y-auto overflow-x-hidden py-4 px-6 shadow min-w-[200px] bg-white z-[999] transition-all max-lg:fixed max-lg:top-[50px] max-lg:-left-52 ${showLeftSideBar && '!left-0'} max-lg:min-h-full-screen
			`}
			>
				<h1 className="text-xl font-bold mb-6 text-grayColor flex items-center gap-2">
					<span className="material-icons-outlined">tune</span>
					تصفية
				</h1>

				<FilterAccordian title="المصدر">
					{sources.map(source => (
						<label
							key={source}
							htmlFor={source}
							className="text-[12px] select-none flex items-center gap-1"
						>
							<input
								type="checkbox"
								id={source}
								value={source}
								onChange={handleChangeSources}
								checked={selectedSources.includes(source)}
							/>
							{source}
						</label>
					))}
				</FilterAccordian>

				<FilterAccordian title="الفئة">
					{categories.map(cate => (
						<div key={cate}>
							<label htmlFor={cate} className="flex items-center gap-1 text-[12px] mb-[2px]">
								<input
									type="checkbox"
									id={cate}
									onChange={handleChangeCategories}
									value={cate}
									checked={selectedCategories.includes(cate)}
								/>
								{cate}
							</label>
						</div>
					))}
				</FilterAccordian>

				{/* Apply Changes Buttons */}
				<div className="flex items-center justify-between gap-1">
					<button
						className="bg-gradient-to-r from-emerald-500 to-lime-600 text-white text-sm py-2 px-2 rounded-lg mt-2 hover:scale-[.98] transition-all duration-200"
						onClick={handleFilterProducts}
					>
						{loading.filterProducts ? <LoadingSpinner /> : 'تطبيق'}
					</button>
					<button
						className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm py-2 px-2 rounded-lg mt-2 hover:scale-[.98] transition-all duration-200"
						onClick={() => {
							setSelectedSources([])
							setSelectedCategories([])
							setCurrentPage(1)
							withLoading(() => getProducts({}), 'clearAllFilters')
						}}
					>
						{loading.clearAllFilters ? <LoadingSpinner /> : 'مسح التغييرات'}
					</button>
				</div>
			</div>
		</>
	)
}

const FilterAccordian = ({ children, title }) => {
	const [show, setShow] = useState(false)

	return (
		<div className="mb-5">
			<motion.h3
				initial={{ x: -120, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				className={`text-sm text-gray-600 flex items-center justify-between select-none cursor-pointer mb-1 pb-1 ${
					show && 'border-b border-b-1'
				}`}
				onClick={() => setShow(p => !p)}
			>
				{title}
				<i className={`material-icons-round transition-all duration-300 ${show && 'rotate-180'}`}>
					arrow_drop_down
				</i>
			</motion.h3>
			<motion.div
				variants={{
					hidden: { height: 0, opacity: 0, pointerEvents: 'none', overflow: 'hidden' },
					visible: { height: 'fit-content', opacity: 1, pointerEvents: 'auto' },
				}}
				initial="hidden"
				animate={show ? 'visible' : 'hidden'}
				className=""
			>
				{children}
			</motion.div>
		</div>
	)
}

export default ProductsLeftSideBar
