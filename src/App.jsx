import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import ProductComments from './components/ProductComments'
import ProductRatings from './components/ProductRatings'
import ScrollWhenRefresh from './components/ScrollWhenRefresh'
import { useUserContext } from './context/UserProvider'
import AdminCreateProduct from './pages/AdminCreateProduct'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'
import AdminUpdateProduct from './pages/AdminUpdateProduct'
import AdminUsers from './pages/AdminUsers'
import Cart from './pages/cart'
import Home from './pages/home'
import Login from './pages/login'
import Order from './pages/order'
import Orders from './pages/orders'
import Product from './pages/product'
import Products from './pages/products'
import Profile from './pages/profile'
import Register from './pages/register'

const App = () => {
	const { currentUser } = useUserContext()

	return (
		<>
			<Header />

			<main style={{ minHeight: 'calc(100vh - 50px)' }} className="mt-[50px] p-[1px]">
				<ScrollWhenRefresh>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={currentUser ? <Navigate to={'/'} /> : <Login />} />
						<Route path="/register" element={currentUser ? <Navigate to={'/'} /> : <Register />} />
						<Route path="/profile/:id" element={currentUser ? <Profile /> : <Login />} />
						<Route path="/products" element={<Products />} />

						<Route path="/products/:id" element={<Product />}>
							<Route index element={<ProductComments />} />
							<Route path="comments" element={<ProductComments />} />
							<Route path="ratings" element={<ProductRatings />} />
						</Route>

						<Route path="/cart" element={currentUser ? <Cart /> : <Login />} />
						<Route path="/orders" element={currentUser ? <Orders /> : <Login />} />
						<Route path="/order/:id" element={currentUser ? <Order /> : <Login />} />

						<Route path="/dashboard">
							<Route path="products" element={currentUser ? <AdminProducts /> : <Login />} />
							<Route
								path="update-product/:id"
								element={currentUser ? <AdminUpdateProduct /> : <Login />}
							/>
							<Route path="create-product" element={currentUser ? <AdminCreateProduct /> : <Login />} />
							<Route path="all-orders" element={currentUser ? <AdminOrders /> : <Login />} />
							<Route path="users" element={currentUser ? <AdminUsers /> : <Login />} />
						</Route>
					</Routes>
				</ScrollWhenRefresh>
			</main>

			<Footer />

			<Toaster position="bottom-right" toastOptions={{ style: { direction: '' } }} />
		</>
	)
}

export default App
