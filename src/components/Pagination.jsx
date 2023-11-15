/* eslint-disable */

const Pagination = ({ pagesCount, currentPage, setCurrentPage }) => {
	const pagesArray = Array.from({ length: pagesCount }, (_, i) => i + 1)

	const handleChangePage = page => {
		setCurrentPage(page)
		// window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}

	return (
		<div className="flex items-center justify-center">
			<div className="flex items-center justify-center gap-3 shadow-lg bg-white rounded-md px-2 py-3">
				{/* previous button */}
				<button
					className="flex items-center justify-center text-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
					disabled={currentPage == 1}
					onClick={() => handleChangePage(currentPage - 1)}
				>
					<span className="material-icons-round ">arrow_forward_ios</span>
				</button>

				{/* pages buttons */}
				{pagesArray.map(page => (
					<button
						className={`flex items-center justify-center text-lg ${
							currentPage == page && 'font-bold text-sky-500'
						}`}
						onClick={() => handleChangePage(page)}
						key={page}
					>
						{page}
					</button>
				))}
				{/* next button */}
				<button
					className="flex items-center justify-center text-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
					disabled={currentPage == pagesCount}
					onClick={() => handleChangePage(currentPage + 1)}
				>
					<span className="material-icons-round">arrow_back_ios</span>
				</button>
			</div>
		</div>
	)
}

export default Pagination
