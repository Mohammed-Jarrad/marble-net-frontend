/* eslint-disable */
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Pagination from '../components/Pagination'
import { useLoadingContext } from '../context/LoadingProvider'
import { useUserContext } from '../context/UserProvider'

const AdminUsers = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const { getAllUsers } = useUserContext()
	const { loading, withLoading } = useLoadingContext()

	useEffect(() => {
		withLoading(() => getAllUsers(), 'getAllUsers')
	}, [])

	if (loading.getAllUsers) return <h1 className="text-3xl text-center mt-12">جاري التحميل</h1>
	if (loading.getAllUsers == undefined) return null
	return (
		<section className="min-h-full-screen">
			<div className="container">
				<UsersTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
			</div>
		</section>
	)
}

export default AdminUsers

function UsersTable({ currentPage, setCurrentPage }) {
	const { allUsers, currentUser, changeUserRole, deleteUser, setAllUsers } = useUserContext()
	const { withLoading } = useLoadingContext()

	const USERS_PER_RECORD = 7
	const pagesCount = Math.ceil(allUsers?.length / USERS_PER_RECORD)
	const lastIndex = currentPage * USERS_PER_RECORD
	const firstIndex = lastIndex - USERS_PER_RECORD
	const __allUsers = allUsers.slice(firstIndex, lastIndex)

	const handleChangeRole = (userId, role) => {
		withLoading(() => changeUserRole(userId, role), 'changeUserRole')
	}
      
	const handleDeleteUser = userId => {
		Swal.fire({
			title: 'هل أنت متأكد؟',
			text: 'سيتم حذف هذا المستخدم!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--main-color)',
			cancelButtonText: 'إلغاء',
			confirmButtonText: 'نعم، متأكد!',
			iconColor: 'red',
			cancelButtonColor: 'var(--red-color)',
		}).then(result => {
			if (result.isConfirmed) {
				withLoading(() => deleteUser(userId, data => {
					setAllUsers(prev => prev.filter(item => item._id !== userId))
				}), 'deleteUser')
			}
		})
	}

	if (allUsers.length == 0) return <h1 className="text-3xl text-center mt-12">لا يوجد مستخدمين.</h1>
	return (
		<>
			<div className="relative overflow-x-auto mt-7 w-full shadow-xl rounded mb-5">
				<table className="w-full text-right text-sm max-sm:text-[12px]">
					<thead className="bg-secondColor text-white">
						<tr>
							<th className="px-6 py-3">الرقم</th>
							<th className="px-6 py-3">الاسم</th>
							<th className="px-6 py-3 whitespace-nowrap">البريد الالكتروني</th>
							<th className="px-6 py-3 whitespace-nowrap">الحالة</th>
							<th className="px-2 py-3">المزيد</th>
						</tr>
					</thead>
					<tbody>
						{__allUsers.map((user, i) => (
							<motion.tr
								initial={{ top: -200, opacity: 0 }}
								animate={{ top: 0, opacity: 1 }}
								transition={{ delay: 0.1 * i }}
								key={user?._id}
								className="relative bg-white border-b hover:bg-gray-50"
							>
								<th className="px-6 py-3 whitespace-nowrap">{i + 1}</th>
								<td className="px-6 py-3 whitespace-nowrap">{user?.username}</td>
								<td className="px-6 py-3 whitespace-nowrap">{user?.email}</td>
								<td className="px-6 py-3 whitespace-nowrap">
									{currentUser?.role == 'admin' ? (
										<select value={user.role} onChange={e => handleChangeRole(user._id, e.target.value)}>
											<option value="admin">admin</option>
											<option value="employee">employee</option>
											<option value="customer">customer</option>
										</select>
									) : (
										<>{user.role}</>
									)}
								</td>
								<td className="px-6 py-3 whitespace-nowrap">
									<button
										className="custom-button bg-red-500 hover:bg-red-600"
										onClick={() => handleDeleteUser(user._id)}
									>
										حذف
									</button>
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
