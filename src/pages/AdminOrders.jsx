/* eslint-disable */

import { useEffect, useState } from 'react'
import { useLoadingContext } from '../context/LoadingProvider'
import { useOrderContext } from '../context/OrderProvider'
import { FiltersOptions } from './orders'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import Swal from 'sweetalert2'

const AdminOrders = () => {
	const { getAllOrders, allOrders } = useOrderContext()
	const { withLoading, loading } = useLoadingContext()

	const [activeStatus, setActiveStatus] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		withLoading(() => getAllOrders({}), 'getAllOrders')
	}, [])

	if (loading.getAllOrders) return <h1 className="text-center text-3xl mt-12">جاري التحميل...</h1>
	else if (loading.getAllOrders == undefined) return null
	return (
		<section>
			<div className="container">
				<FiltersOptions
					activeStatus={activeStatus}
					setActiveStatus={setActiveStatus}
					setCurrentPage={setCurrentPage}
					methodToFilterProducts={getAllOrders}
				/>
				{allOrders.length == 0 ? (
					<h1 className="text-3xl text-center mt-12">لا يوجد طلبات حالياً</h1>
				) : (
					<OrdersTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
				)}
			</div>
		</section>
	)
}

export default AdminOrders

function OrdersTable({ currentPage, setCurrentPage }) {
	const { allOrders, deleteOrder } = useOrderContext()
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
	const ORDERS_PER_PAGE = 5
	const pagesCount = Math.ceil(allOrders?.length / ORDERS_PER_PAGE)
	const lastIndex = currentPage * ORDERS_PER_PAGE
	const firstIndex = lastIndex - ORDERS_PER_PAGE
	const __allOrders = allOrders.slice(firstIndex, lastIndex)

	const handleDeleteOrder = orderId => {
		Swal.fire({
			title: 'هل أنت متأكد؟',
			text: 'لن تستطيع إعادة هذا الطلب!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--main-color)',
			cancelButtonText: 'إلغاء',
			confirmButtonText: 'نعم، متأكد!',
			iconColor: 'red',
			cancelButtonColor: 'var(--red-color)',
		}).then(result => {
			if (result.isConfirmed) {
				deleteOrder(orderId, data => {
					console.log(data)
				})
			}
		})
	}

	return (
		<>
			<div className="relative overflow-x-auto mt-12 w-full shadow-xl rounded mb-5">
				<table className="w-full text-right text-sm max-sm:text-[12px]">
					<thead className="bg-secondColor text-white">
						<tr>
							<th className="px-6 py-3">الرقم</th>
							<th className="px-6 py-3 whitespace-nowrap">اسم المستخدم</th>
							<th className="px-6 py-3">العنوان</th>
							<th className="px-6 py-3">الحالة</th>
							<th className="px-6 py-3">التاريخ</th>
							<th className="px-6 py-3">المزيد</th>
						</tr>
					</thead>
					<tbody>
						{[...__allOrders].map((order, i) => (
							<motion.tr
								initial={{ top: -200, opacity: 0 }}
								animate={{ top: 0, opacity: 1 }}
								transition={{ delay: 0.1 * i }}
								key={order?._id}
								className="relative bg-white border-b hover:bg-gray-50"
							>
								<th className="px-7 py-2">{i + 1}</th>
								<td className="px-6 py-2 whitespace-nowrap">{order?.user?.username}</td>
								<td className="px-6 py-2 whitespace-nowrap">{order?.shippingAddress}</td>
								<td className="px-6 py-2 whitespace-nowrap">
									<div className="flex items-center gap-2">
										<i className={`material-icons-round ${getOrderStatusInfo(order?.status).color}`}>
											{getOrderStatusInfo(order?.status).icon}
										</i>
										<span>{getOrderStatusInfo(order?.status).text}</span>
									</div>
								</td>
								<td className="px-6 py-2 whitespace-nowrap">
									{new Intl.DateTimeFormat('ar-eg', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										weekday: 'long',
									}).format(new Date(order?.createdAt))}
								</td>
								<td className="px-6 py-2">
									<div className="flex items-center gap-1">
										<Link
											to={`/order/${order?._id}`}
											className="material-icons-round text-greenColor text-3xl"
										>
											more_horiz
										</Link>
										<button
											className="material-icons-round text-red-500 hover:text-red-600 text-xl"
											onClick={() => handleDeleteOrder(order._id)}
										>
											delete
										</button>
									</div>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount} />
		</>
	)
}
