/* eslint-disable */
import { motion } from 'framer-motion'
import { useEffect } from 'react'

const Modal = ({ children, open, setOpen }) => {
	const closeModal = () => setOpen(false)

	const handleEscKeyPress = event => (event.keyCode === 27 ? closeModal() : null)
	useEffect(() => {
		window.addEventListener('keydown', handleEscKeyPress)
		return () => {
			window.removeEventListener('keydown', handleEscKeyPress)
		}
	}, [])

	return (
		<motion.div
			className={`fixed inset-0 flex justify-center items-center bg-black/25 z-[999] px-3`}
			onClick={closeModal}
			variants={{
				hidden: { opacity: 0, pointerEvents: 'none' },
				visible: { opacity: 1, pointerEvents: 'auto' },
			}}
			initial="hidden"
			animate={open ? 'visible' : 'hidden'}
			transition={{ duration: 0.2 }}
		>
			<motion.div
				className="relative bg-white shadow max-sm:w-[90%] max-md:w-[80%] md:min-w-[40%] sm:max-w-full max-h-[80%] py-4 px-4 md:px-14 pt-10 rounded overflow-y-auto"
				onClick={e => e.stopPropagation()}
				variants={{
					hidden: { scale: 0, opacity: 0 },
					visible: { scale: 1, opacity: 1 },
				}}
				initial="hidden"
				animate={open ? 'visible' : 'hidden'}
				transition={{ duration: 0.4 }}
			>
				<div className="absolute top-2 right-2 w-6 h-6 bg-red-500 flex items-center justify-center text-white rounded-full hover:bg-red-600 transition-all">
					<button className="material-icons-round text-base" onClick={closeModal}>
						close
					</button>
				</div>
				<div className="p-2">{children}</div>
			</motion.div>
		</motion.div>
	)
}
export default Modal
