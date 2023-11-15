/* eslint-disable */
import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { useCartContext } from '../context/CartProvider'
import { useLoadingContext } from '../context/LoadingProvider'
import { useOrderContext } from '../context/OrderProvider'
import { useUserContext } from '../context/UserProvider'
import Modal from './Modal'

export default function Checkout() {
	const { createOrder } = useOrderContext()
	const { loading, withLoading } = useLoadingContext()
	const { currentUser } = useUserContext()
	const { cart } = useCartContext()
	const [show, setShow] = useState()
	const [userPhone, setUserPhone] = useState('')
	const [address, setAddress] = useState('')

	const handleCreateOrder = e => {
		e.preventDefault()
		const products = [...cart.items].map(item => ({
			product: item.product._id,
			quantity: item.quantity,
			productNotes: item?.productNotes ? item.productNotes : null,
		}))
		const order = {
			user: currentUser?._id,
			userPhone,
			shippingAddress: address,
			products,
		}
		withLoading(
			() =>
				createOrder(order, data => {
					setShow(false)
				}),
			'createOrder',
		)
	}

	return (
		<div className="w-full ">
			<button
				className="bg-secondColor text-white my-12 max-sm:w-full w-1/2 py-2 text-xl hover:bg-cyan-700 transition-all block mx-auto"
				onClick={() => setShow(p => !p)}
			>
				تأكيد الطلب
			</button>
			<Modal open={show} setOpen={setShow}>
				<p className="text-[12px] mb-7">
					<strong className="text-xl text-red-500">* </strong>
					نحتاج لمعلومات إضافية لإكمال الطلب
				</p>
				<form className="flex flex-col gap-2" onSubmit={handleCreateOrder}>
					<div className="flex flex-col gap-2">
						<label htmlFor="phone" className="text-sm">
							رقم الهاتف:{' '}
						</label>
						<input
							type="text"
							placeholder="رقم الهاتف..."
							className="form-input"
							id="phone"
							value={userPhone}
							onChange={e => setUserPhone(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="address" className="text-sm">
							العنوان:{' '}
						</label>
						<input
							type="text"
							placeholder="العنوان..."
							className="form-input"
							id="address"
							value={address}
							onChange={e => setAddress(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						className="bg-secondColor text-white max-sm:w-full mt-2 w-1/2 py-2 text-xl hover:bg-cyan-700 transition-all block mx-auto rounded"
					>
						{loading.createOrder ? <LoadingSpinner /> : 'تأكيد الطلب'}
					</button>
				</form>
			</Modal>
		</div>
	)
}
