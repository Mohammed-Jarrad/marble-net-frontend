/* eslint-disable */
const Rating = ({ rating }) => {
	return (
		<div className="flex items-center justify-center w-fit">
			{[1, 2, 3, 4, 5].map(star => (
				<i
					key={star}
					className={`material-icons-round ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
				>
					{star <= rating ? 'star' : 'star_border'}
				</i>
			))}
		</div>
	)
}

export default Rating
