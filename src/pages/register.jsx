import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useLoadingContext } from '../context/LoadingProvider'

const Register = () => {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { loading, withLoading } = useLoadingContext()

	const register = e => {
		e.preventDefault()
		withLoading(async () => {
			try {
				const { data } = await axios.post(
					'/api/auth/register',
					{ username, email, password },
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				)
				toast.success(data?.message)
			} catch (error) {
				toast.error(error.response.data.message)
			}
		}, 'register')
	}

	return (
		<section className="min-h-full-screen">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:min-h-full-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
							إنشاء حساب
						</h1>
						<form className="space-y-4 md:space-y-6" onSubmit={register}>
							<div>
								<label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
									الاسم
								</label>
								<input
									type="username"
									name="username"
									id="username"
									className="form-input"
									dir="ltr"
									placeholder="John Doe"
									value={username}
									onChange={e => setUsername(e.target.value)}
								/>
							</div>
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
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</div>
							<button
								type="submit"
								className="w-full text-white bg-secondColor hover:bg-secondColor focus:ring-4 focus:outline-none focus:ring-secondColor font-medium rounded-lg text-sm px-5 py-2.5 text-center"
								disabled={loading.register}
							>
								{loading.register ? 'جارِ أنشاء حساب...' : 'إنشاء حساب'}
							</button>
							<p className="text-sm font-light text-gray-500">
								لديك حساب بالفعل؟{' '}
								<Link to={'/login'} className="text-secondColor hover:underline font-medium">
									تسجيل دخول
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Register
