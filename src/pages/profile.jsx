/* eslint-disable */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { useLoadingContext } from '../context/LoadingProvider'
import { useUserContext } from '../context/UserProvider'

const Profile = () => {
	const { id } = useParams()
	const { getUserProfile, currentProfile, currentUser, deleteUser, setCurrentUser } = useUserContext()
	const { withLoading, loading } = useLoadingContext()
	const [showEdit, setShowEdit] = useState(false)

	useEffect(() => {
		withLoading(() => getUserProfile(id), 'getUserProfile')
	}, [])

	const navigate = useNavigate()

	const handleDeleteProfile = () => {
		Swal.fire({
			title: 'هل أنت متأكد؟',
			text: 'سيتم حذف هذا الحساب!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--main-color)',
			cancelButtonText: 'إلغاء',
			confirmButtonText: 'نعم، متأكد!',
			iconColor: 'red',
			cancelButtonColor: 'var(--red-color)',
		}).then(result => {
			if (result.isConfirmed) {
				withLoading(
					() =>
						deleteUser(currentProfile._id, () => {
							localStorage.removeItem('currentUser')
							setCurrentUser(null)
							navigate('/login')
						}),
					'deleteProfile',
				)
			}
		})
	}

	if (loading.getUserProfile || loading.deleteProfile)
		return <h1 className="text-center text-3xl mt-12">جاري التحميل...</h1>
	else if (loading.getUserProfile == undefined) return null
	return (
		<section className="min-h-full-screen flex items-center justify-center flex-col py-5 max-sm:px-2">
			<div className="container !w-[500px] max-w-full rounded shadow-sm bg-white p-3">
				<h1 className="text-center text-xl font-medium border-b pb-2 w-fit mx-auto">الصفحة الشخصية</h1>
				<img src="/images/defaultUser.png" alt="" className="mx-auto w-28 h-28 my-12" />
				{/* infos */}
				<div className="border flex flex-col items-center justify-center max-sm:text-sm">
					<div className="border-b w-full flex items-center">
						<p className="border-l w-32 p-2">الاسم</p>
						<p className="p-2">{currentProfile.username}</p>
					</div>
					<div className="border-b w-full flex items-center">
						<p className="border-l w-32 p-2">البريد الالكتروني</p>
						<p className="p-2">{currentProfile.email}</p>
					</div>
				</div>

				<div className="flex items-center justify-center gap-3 mt-12">
					<button
						className={`custom-button bg-green-500 hover:bg-green-600 flex-1 ${
							currentUser._id == currentProfile._id ||
							currentUser.role == 'admin' ||
							currentUser.role == 'employee'
								? 'block'
								: 'hidden'
						}`}
						onClick={() => setShowEdit(true)}
					>
						تعديل
					</button>
					<button
						className={`custom-button bg-red-500 hover:bg-red-600 flex-1`}
						onClick={handleDeleteProfile}
					>
						حذف الحساب
					</button>
				</div>
			</div>
			<EditModal open={showEdit} setOpen={setShowEdit} />
		</section>
	)
}

export default Profile

function EditModal({ open, setOpen }) {
	const { withLoading, loading } = useLoadingContext()
	const { updateUserProfile, currentProfile } = useUserContext()
	const [username, setUsername] = useState(currentProfile?.username)
	const [email, setEmail] = useState(currentProfile?.email)
	const [password, setPassword] = useState('')

	const handleUpdateUserInfos = e => {
		e.preventDefault()
		withLoading(
			() =>
				updateUserProfile(currentProfile?._id, { username, email, password }, () => {
					setOpen(false)
					setPassword('')
				}),
			'updateUserProfile',
		)
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<form className="flex flex-col items-center gap-5" onSubmit={handleUpdateUserInfos}>
				<div className="flex flex-col whitespace-nowrap items-start gap-2 w-[500px] max-w-full ">
					<label htmlFor="username" className="text-gray-500">
						الاسم
					</label>
					<input
						id="username"
						type="text"
						onChange={e => setUsername(e.target.value)}
						placeholder={'الاسم الجديد...'}
						value={username}
						className="form-input"
					/>
				</div>
				<div className="flex flex-col whitespace-nowrap items-start gap-2 w-[500px] max-w-full ">
					<label htmlFor="email" className="text-gray-500">
						البريد الالكتروني
					</label>
					<input
						id="email"
						type="email"
						onChange={e => setEmail(e.target.value)}
						placeholder={'البريد الالكتروني الجديد...'}
						value={email}
						className="form-input"
					/>
				</div>
				<div className="flex flex-col whitespace-nowrap items-start gap-2 w-[500px] max-w-full ">
					<label htmlFor="password" className="text-gray-500">
						البريد الالكتروني
					</label>
					<input
						id="password"
						type="password"
						onChange={e => setPassword(e.target.value)}
						placeholder={'كلمة المرور الجديدة...'}
						value={password}
						className="form-input"
					/>
				</div>

				<button type="submit" className="custom-button bg-secondColor hover:bg-cyan-700 w-48">
					{loading.updateUserProfile ? <LoadingSpinner /> : 'تغيير'}
				</button>
			</form>
		</Modal>
	)
}
