import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserProvider'

const ProfileButton = () => {
	const { currentUser, setCurrentUser } = useUserContext()
	const [showMenu, setShowMenu] = useState(false)
	const toggleShow = () => setShowMenu(p => !p)
	const navigate = useNavigate()
	const logout = () => {
		localStorage.removeItem('currentUser')
		setCurrentUser(null)
		navigate('/login')
	}
	return (
		<li
			onClick={toggleShow}
			className="group flex relative gap-1 cursor-pointer items-center justify-center ml-4"
		>
			<i
				className={`material-icons-round text-gray-500 group-hover:text-secondColor text-[28px] transition-all ${
					showMenu && 'rotate-180'
				}`}
			>
				arrow_drop_down
			</i>
			<p className="select-none">{currentUser?.username}</p>

			<motion.div
				className={`absolute top-[50px] right-0 w-[200px] z-[99] bg-navColor shadow-md`}
				variants={{
					hidden: { height: 0, opacity: 0, pointerEvents: 'none', overflow: 'hidden' },
					visible: { height: 'fit-content', opacity: 1, pointerEvents: 'auto' },
				}}
				initial="hidden"
				animate={showMenu ? 'visible' : 'hidden'}
			>
				<Link
					to={`/profile/${currentUser._id}`}
					className="p-3 flex items-center gap-2 text-[13px] transition-all hover:font-semibold "
				>
					<span className="material-icons-outlined text-secondColor">account_circle</span>
					الصفحة الشخصية
				</Link>
				<hr />
				<div
					onClick={logout}
					className="p-3 flex items-center gap-2 text-[13px] transition-all hover:font-semibold "
				>
					<i className="material-icons-round text-secondColor">logout</i>
					تسجيل خروج
				</div>
			</motion.div>
		</li>
	)
}

export default ProfileButton
