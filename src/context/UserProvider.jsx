/* eslint-disable */
import axios from 'axios'
import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const UserContext = createContext(null)

const UserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(
		localStorage.currentUser ? JSON.parse(localStorage.currentUser) : null,
	)
	const [allUsers, setAllUsers] = useState([])
	const [currentProfile, setCurrentProfile] = useState({})

	async function getAllUsers() {
		try {
			const { data, status } = await axios.get(`/api/users/profile`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				setAllUsers(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function changeUserRole(userId, role, callback) {
		try {
			const { data, status } = await axios.put(
				`/api/users/update-role/${userId}`,
				{ role },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + currentUser?.token,
					},
				},
			)
			if (status == 200) {
				setAllUsers(prev => prev.map(item => (item._id == userId ? data.user : item)))
				callback && callback(data)
				toast.success(data.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function deleteUser(userId, callback) {
		try {
			const { data, status } = await axios.delete(`/api/users/profile/${userId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				callback && callback(data)
				toast.success(data.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function getUserProfile(userId, callback) {
		try {
			const { data, status } = await axios.get(`/api/users/profile/${userId}`, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (status == 200) {
				setCurrentProfile(data)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	async function updateUserProfile(userId, infos, callback) {
		try {
			const { data, status } = await axios.put(`/api/users/profile/${userId}`, infos, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			})
			if (status == 200) {
				setCurrentProfile(data.user)
				console.log(data)
				if (currentUser._id == userId) {
					// update local storage infos
					let infos = JSON.parse(localStorage.currentUser)
					infos.username = data.user.username
					localStorage.currentUser = JSON.stringify(infos)
				}
				toast.success(data.message)
				callback && callback(data)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	return (
		<UserContext.Provider
			value={{
				currentUser,
				setCurrentUser,
				allUsers,
				setAllUsers,
				getAllUsers,
				changeUserRole,
				deleteUser,
				getUserProfile,
				setCurrentProfile,
				currentProfile,
				updateUserProfile,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export default UserProvider

export const useUserContext = () => {
	const {
		currentUser,
		setCurrentUser,
		allUsers,
		setAllUsers,
		getAllUsers,
		changeUserRole,
		deleteUser,
		getUserProfile,
		setCurrentProfile,
		currentProfile,
		updateUserProfile,
	} = useContext(UserContext)
	return {
		currentUser,
		setCurrentUser,
		allUsers,
		setAllUsers,
		getAllUsers,
		changeUserRole,
		deleteUser,
		getUserProfile,
		setCurrentProfile,
		currentProfile,
		updateUserProfile,
	}
}
