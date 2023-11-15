/* eslint-disable */

const LoadingSpinner = ({ width, height }) => {
	return (
		<div className="flex items-center justify-center w-12 mx-auto">
			<div
				className="border-t-[3px] w-6 h-6 rounded-full animate-spin"
				style={{
					width,
					height,
				}}
			></div>
		</div>
	)
}

export default LoadingSpinner
