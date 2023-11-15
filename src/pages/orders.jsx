/* eslint-disable */
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import { useLoadingContext } from '../context/LoadingProvider'
import { useOrderContext } from '../context/OrderProvider'

const Orders = () => {
	const { getOrdersForUser, ordersForUser } = useOrderContext()
	const { withLoading, loading } = useLoadingContext()
	const [activeStatus, setActiveStatus] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	useEffect(() => {
		withLoading(() => getOrdersForUser({}), 'getOrdersForUser')
	}, [])

	if (loading.getOrdersForUser) return <h1 className="text-3xl mt-12 text-center">جاري التحميل...</h1>
	return (
		<section className="container">
			<FiltersOptions
				activeStatus={activeStatus}
				setActiveStatus={setActiveStatus}
				methodToFilterProducts={getOrdersForUser}
				setCurrentPage={setCurrentPage}
			/>
			{ordersForUser.length == 0 && loading.getOrdersForUser == false ? (
				<h1 className="text-3xl text-center mt-12">لا يوجد طلبات حالياً</h1>
			) : (
				<OrdersTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
			)}
		</section>
	)
}

export default Orders

export function FiltersOptions({
	activeStatus,
	setActiveStatus,
	methodToFilterProducts,
	setCurrentPage,
}) {
	const { withLoading, loading } = useLoadingContext()
	const statusArray = [
		{ a: 'الكل', e: 'all' },
		{ a: 'قيد الانتظار', e: 'pending' },
		{ a: 'تم التأكيد', e: 'confirmed' },
		{ a: 'تم التوصيل', e: 'shipped' },
		{ a: 'ملغي', e: 'canceled' },
	]

	const handleFilterOrdersByStatus = value => {
		withLoading(() => methodToFilterProducts({ status: value == 'all' ? '' : value }), 'filterOrders')
		setActiveStatus(value)
		setCurrentPage(1)
	}
	return (
		<div className="flex justify-center items-center mt-12 gap-4 bg-gray-200 w-fit mx-auto rounded-xl overflow-hidden max-sm:flex-wrap max-sm:gap-1">
			{statusArray.map(item => (
				<button
					className={`${
						activeStatus == item.e && 'border-b-[3px] border-cyan-400 text-gray-900 font-bold'
					} p-2 text-center transition-all text-sm text-gray-700 max-sm:text-[12px] max-sm:whitespace-nowrap`}
					key={item.a}
					onClick={() => handleFilterOrdersByStatus(item.e)}
				>
					{item.a}
					{item.e == activeStatus && loading.filterOrders && '...'}
				</button>
			))}
		</div>
	)
}

function OrdersTable({ currentPage, setCurrentPage }) {
	const { ordersForUser } = useOrderContext()
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
	const pagesCount = Math.ceil(ordersForUser?.length / ORDERS_PER_PAGE)
	const lastIndex = currentPage * ORDERS_PER_PAGE
	const firstIndex = lastIndex - ORDERS_PER_PAGE
	const __ordersForUser = ordersForUser.slice(firstIndex, lastIndex)
	return (
		<>
			<div className="relative overflow-x-auto mt-12 w-full shadow-xl rounded mb-5">
				<table className="w-full text-right text-sm max-sm:text-[12px]">
					<thead className="bg-secondColor text-white">
						<tr>
							<th className="px-6 py-3">الرقم</th>
							<th className="px-6 py-3">العنوان</th>
							<th className="px-6 py-3">الحالة</th>
							<th className="px-6 py-3">التاريخ</th>
							<th className="px-6 py-3">المزيد</th>
						</tr>
					</thead>
					<tbody>
						{[...__ordersForUser].map((order, i) => (
							<motion.tr
								initial={{ top: -200, opacity: 0 }}
								animate={{ top: 0, opacity: 1 }}
								transition={{ delay: 0.1 * i }}
								key={order?._id}
								className="relative bg-white border-b hover:bg-gray-50"
							>
								<th className="px-7 py-2">{i + 1}</th>
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
									<Link
										to={`/order/${order?._id}`}
										className="material-icons-round text-greenColor text-3xl"
									>
										more_horiz
									</Link>
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
