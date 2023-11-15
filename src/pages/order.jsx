/* eslint-disable */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { useLoadingContext } from '../context/LoadingProvider'
import { useOrderContext } from '../context/OrderProvider'
import { useUserContext } from '../context/UserProvider'
import { ProductNotesModal } from './cart'

const Order = () => {
	const { id } = useParams()
	const { getCurrentOrder, currentOrder } = useOrderContext()
	const { withLoading, loading } = useLoadingContext()
	const { currentUser } = useUserContext()
	const [openNotesModal, setOpenNotesModal] = useState(false)
	const [openEditStatus, setOpenEditStatus] = useState(false)
	useEffect(() => {
		withLoading(() => getCurrentOrder(id), 'getCurrentOrder')
	}, [])

	const getOrderStatusInfo = value => {
		switch (value) {
			case 'pending':
				return { text: 'قيد الإنتظار', color: 'text-sky-500', icon: 'hourglass_empty' }
			case 'confirmed':
				return { text: 'تم التأكيد', color: 'text-orange-500', icon: 'verified' }
			case 'shipped':
				return { text: 'تم التوصيل', color: 'text-green-500', icon: 'done_all' }
			case 'canceled':
				return { text: 'ملغي', color: 'text-red-500', icon: 'block' }
		}
	}

	if (loading.getCurrentOrder) {
		return <h1 className="mt-12 text-3xl text-center">جاري التحميل...</h1>
	} else if (loading.getCurrentOrder == undefined) return null
	return (
		<section className="container flex flex-col gap-10 mb-10">
			{/* order user infos and shipping address */}
			<div className="py-2 px-5 mt-8 shadow-md rounded bg-white">
				<h1 className="text-xl sm:text-2xl text-center text-gray-500 border-b border-gray-300 w-fit mx-auto pb-1">
					معلومات الطلب
				</h1>
				<div className="flex items-center justify-between sm:justify-center mt-7 flex-wrap gap-3">
					<div className="flex-1 text-center whitespace-nowrap px-4 sm:px-7">
						<p className="text-sm font-medium text-gray-950">اسم صاحب الطلب</p>
						<p className="text-gray-500 mt-2">{currentOrder?.user?.username}</p>
					</div>
					<div className="flex-1 text-center whitespace-nowrap px-4 sm:px-7">
						<p className="text-sm font-medium text-gray-950">رقم الهاتف</p>
						<p className="text-gray-500 mt-2">{currentOrder?.userPhone}</p>
					</div>
					<div className="flex-1 text-center whitespace-nowrap px-4 sm:px-7">
						<p className="text-sm font-medium text-gray-950">العنوان</p>
						<p className="text-gray-500 mt-2">{currentOrder?.shippingAddress}</p>
					</div>
				</div>
			</div>
			{/* order details */}
			<div className="py-2 px-5 mt-8">
				<h1 className="text-xl sm:text-2xl text-center text-gray-500 border-b border-gray-300 w-fit mx-auto pb-1">
					محتوى الطلب -{' '}
					<span>{new Intl.DateTimeFormat('ar-EG', {}).format(new Date(currentOrder?.createdAt))}</span>
					<p className="flex items-center gap-2 justify-center text-lg mt-1">
						<i
							className={`material-icons-round  ${getOrderStatusInfo(currentOrder?.status).color}
                        ${currentOrder?.status == 'pending' && 'animate-spin'}`}
						>
							{getOrderStatusInfo(currentOrder?.status).icon}
						</i>
						{getOrderStatusInfo(currentOrder?.status).text}
						{(currentUser?.role == 'admin' || currentUser?.role == 'employee') && (
							<button className="text-[13px] underline" onClick={() => setOpenEditStatus(true)}>
								تعديل
							</button>
						)}
					</p>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 items-center">
					{currentOrder?.products?.map(item => (
						<OrderProductItem item={item} key={item._id} />
					))}
				</div>
			</div>
			{/* order notes */}
			<div className="py-2 px-5 mt-4">
				<div className="text-xl sm:text-2xl text-center text-gray-500 border-b border-gray-300 w-fit mx-auto pb-1 flex items-center gap-2">
					ملاحظات على الطلب
					{(currentUser?.role == 'admin' || currentUser?.role == 'employee') && (
						<button
							className="material-icons-round text-lg w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-all"
							onClick={() => setOpenNotesModal(true)}
						>
							edit
						</button>
					)}
				</div>
				<div className="text-lg">
					{currentOrder?.notes ? (
						<div className="mt-3 w-full max-w-lg mx-auto text-gray-600 relative">
							<div>
								{currentOrder?.notes?.split(`\n`).map((line, i) => (
									<p key={i}>{line}</p>
								))}
							</div>
						</div>
					) : (
						<p className="text-gray-500 mt-3 text-center">لا يوجد ملاحظات حالياً.</p>
					)}
				</div>
			</div>

			<UpdateOrderNotesModal open={openNotesModal} setOpen={setOpenNotesModal} />
			<UpdateOrderStatusModal open={openEditStatus} setOpen={setOpenEditStatus} />
		</section>
	)
}

export default Order

function OrderProductItem({ item }) {
	const [show, setShow] = useState(false)

	return (
		<div className="bg-white shadow-sm rounded flex items-stretch gap-3 h-28">
			<Link to={`/products/${item.product._id}`}>
				<img src={item.product.image.url} alt="" className="w-28 h-full object-cover" />
			</Link>
			<div className="p-3 text-sm flex-1 flex flex-col justify-between">
				<div className="flex items-center justify-between w-full">
					<p className="font-medium text-lg">{item.product.name}</p>
					{item?.productNotes && (
						<button className="material-icons-round text-xl text-cyan-600 animate-bounce" onClick={() => setShow(true)}>
							description
						</button>
					)}
				</div>
				{/* <p>{item.product.source}</p> */}
				{/* <p>{item.product.category}</p> */}
				<p className="font-semibold">الكمية {item.quantity}</p>
			</div>
			<ProductNotesModal open={show} setOpen={setShow} notes={item?.productNotes} />
		</div>
	)
}

function UpdateOrderNotesModal({ open, setOpen }) {
	const { currentOrder, updateOrderNotes } = useOrderContext()
	const { withLoading, loading } = useLoadingContext()

	const [newNotes, setNewNotes] = useState('')

	const handleUpdateOrderNote = e => {
		e.preventDefault()
		withLoading(
			() =>
				updateOrderNotes(newNotes, currentOrder?._id, () => {
					setOpen(false)
				}),
			'updateOrderNotes',
		)
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<form className="flex flex-col justify-center" onSubmit={handleUpdateOrderNote}>
				<p className="text-gray-500 mb-3 text-sm">أدخل الملاحظات الجديدة</p>
				<textarea
					cols="30"
					rows="5"
					defaultValue={currentOrder?.notes}
					className="form-input resize-none text-sm"
					onChange={e => setNewNotes(e.target.value)}
				/>
				<button
					type="submit"
					className="bg-cyan-500 text-white rounded mt-3 py-2 transition-all hover:bg-cyan-600"
				>
					{loading.updateOrderNotes ? <LoadingSpinner /> : 'تعديل الملاحظات'}
				</button>
			</form>
		</Modal>
	)
}

function UpdateOrderStatusModal({ open, setOpen }) {
	const { currentOrder, updateOrderStatus } = useOrderContext()
	const { withLoading, loading } = useLoadingContext()
	const [newStatus, setNewStatus] = useState('')
	const handleUpdateStatus = e => {
		e.preventDefault()
		withLoading(
			() =>
				updateOrderStatus(newStatus, currentOrder?._id, () => {
					setOpen(false)
				}),
			'updateOrderStatus',
		)
	}
	return (
		<Modal open={open} setOpen={setOpen}>
			<form onSubmit={handleUpdateStatus}>
				<p className="text-gray-500 mb-3 text-sm">قم باختيار الحالة الجديدة</p>
				<select
					onChange={e => setNewStatus(e.target.value)}
					className="border border-gray-400 bg-transparent text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none  block w-full py-1 px-3 rounded"
					defaultValue={currentOrder?.status}
				>
					<option value="pending">قيد اللإنتظار</option>
					<option value="confirmed">تم التأكيد</option>
					<option value="shipped">تم التوصيل</option>
					<option value="canceled">ملغي</option>
				</select>
				<button
					type="submit"
					className="w-full bg-cyan-500 text-white rounded mt-3 py-2 transition-all hover:bg-cyan-600"
				>
					{loading.updateOrderStatus ? <LoadingSpinner /> : 'تغيير الحالة'}
				</button>
			</form>
		</Modal>
	)
}
