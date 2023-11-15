import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useLoadingContext } from "../context/LoadingProvider"
import { useUserContext } from '../context/UserProvider'

const Login = () => {
	const { setCurrentUser } = useUserContext()
	const { loading, withLoading } = useLoadingContext()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const login = e => {
		e.preventDefault()
		withLoading(async () => {
			try {
				const user = { email, password }
				const { data } = await axios.post('/api/auth/login', user, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				localStorage.setItem('currentUser', JSON.stringify(data))
				setCurrentUser(data)
			} catch (error) {
				toast.error(error.response.data.message)
			}
		}, 'login')
	}

	return (
		<section className="min-h-full-screen">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:min-h-full-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
							تسجيل الدخول
						</h1>
						<form className="space-y-4 md:space-y-6" onSubmit={login}>
							<div>
								<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
									البريد الالكتروني
								</label>
								<input
									type="email"
									name="email"
									id="email"
									className="form-input"
									dir="ltr"
									placeholder="name@example.com"
									// required
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
									كلمة المرور
								</label>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									dir="ltr"
									className="form-input"
									// required
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</div>
							<button
								type="submit"
								className="w-full text-white bg-secondColor hover:bg-secondColor focus:ring-4 focus:outline-none focus:ring-secondColor font-medium rounded-lg text-sm px-5 py-2.5 text-center"
								disabled={loading.login}
							>
								{loading.login ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
							</button>
							<p className="text-sm font-light text-gray-500">
								ليس لديك حساب؟{' '}
								<Link to={'/register'} className="text-secondColor hover:underline font-medium">
									أنشئ حساب
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Login
