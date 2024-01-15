/* eslint-disable */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartContext } from '../context/CartProvider';
import { useLoadingContext } from '../context/LoadingProvider';
import { useUserContext } from '../context/UserProvider';
import ProfileButton from './ProfileButton';

const Header = () => {
	const { currentUser } = useUserContext();
	const { getUserCart } = useCartContext();
	const { withLoading } = useLoadingContext();

	useEffect(() => {
		if (currentUser) {
			withLoading(() => getUserCart(), 'getUserCart');
		}
	}, []);

	return (
		<header
			className="h-[50px] bg-gradient-to-r from-slate-300 via-slate-100 to-slate-200 
        fixed top-0 right-0 left-0 z-[99999] shadow"
		>
			<DesktopNavbar />
			<MobileNavbar />
		</header>
	);
};

export default Header;

const DesktopNavbar = () => {
	const { currentUser } = useUserContext();
	const { cart, getUserCart } = useCartContext();
	return (
		<div className="container h-full flex items-stretch justify-between max-lg:hidden">
			<ul className="flex items-stretch gap-3 text-sm justify-start">
				{!currentUser ? (
					<>
						{/* Non user Links */}
						<NavItem icon={'person_add'} title={'إنشاء حساب'} to={`/register`} />
						<NavItem icon={'login'} title={'تسجيل الدخول'} to={`/login`} />
						<NavItem icon={'category'} to={`/products`} title={'المنتجات'} />
						<NavItem icon={'info'} title={'من نحن'} to={'/about'} />
						<NavItem icon={'diversity_3'} title={'عملاؤنا'} to={'/our-clients'} />
					</>
				) : (
					<>
						<ProfileButton />
						{currentUser.role == 'customer' ? (
							<>
								{/* Customer Links */}
								<NavItem icon={'home'} to={`/`} title={'الرئيسية'} />
								<NavItem icon={'category'} to={`/products`} title={'المنتجات'} />
								<NavItem icon={'info'} title={'من نحن'} to={'/about'} />
								<NavItem icon={'diversity_3'} title={'عملاؤنا'} to={'/our-clients'} />
								<NavItem icon={'local_mall'} title={'السلة'} to={`/cart`}>
									<span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
										{cart?.items?.length}
									</span>
								</NavItem>
								<NavItem icon={'list_alt'} title={'الطلبات'} to={`/orders`} />
							</>
						) : currentUser.role == 'admin' || currentUser.role == 'employee' ? (
							<>
								{/* Admin & Employee Links */}
								<NavItem icon={'fact_check'} title={'كل المنتجات'} to={`/dashboard/products`} />
								<NavItem icon={'add'} title={'إنشاء منتج'} to={`/dashboard/create-product`} />
								<NavItem icon={'reorder'} title={'كل الطلبات'} to={`/dashboard/all-orders`} />
								<NavItem icon={'people'} title={'المستخدمين'} to={`/dashboard/users`} />
								<NavItem icon={'diversity_3'} title={'العملاء'} to={'/dashboard/our-clients'} />
							</>
						) : null}
					</>
				)}
			</ul>

			{/* Logo */}
			<Link to={'/'} className="p-1">
				<img src="/images/logo.svg" alt="logo" className="  h-full max-h-full object-contain" />
			</Link>
		</div>
	);
};

const MobileNavbar = () => {
	const { currentUser } = useUserContext();
	const { cart } = useCartContext();
	const [show, setShow] = useState(false);
	return (
		<div className="container h-full flex items-stretch justify-between lg:hidden">
			{/* overlay */}
			<div
				className={`fixed inset-0 top-[50px] bg-black/40 z-[999] transition-all ${
					show ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				onClick={() => setShow(false)}
			/>
			<div className="flex items-center">
				{currentUser && <ProfileButton />}
				<button
					className={`material-icons-round transition-all ${
						show ? 'text-red-500 hover:text-red-600' : 'text-secondColor hover:text-cyan-700'
					}`}
					onClick={() => setShow(p => !p)}
				>
					{show ? 'close' : 'reorder'}
				</button>
			</div>
			<ul
				className={`absolute top-[50px] w-full right-0 bg-white transition-all duration-500 ${
					show ? 'opacity-100 z-[999]' : 'opacity-0 overflow-hidden pointer-events-none'
				}`}
			>
				{!currentUser ? (
					<>
						{/* Non user Links */}
						<NavItem icon={'person_add'} title={'إنشاء حساب'} to={`/register`} setShow={setShow} />
						<NavItem icon={'login'} title={'تسجيل الدخول'} to={`/login`} setShow={setShow} />
						<NavItem icon={'category'} to={`/products`} title={'المنتجات'} setShow={setShow} />
					</>
				) : (
					<>
						{currentUser.role == 'customer' ? (
							<>
								{/* Customer Links */}
								<NavItem icon={'home'} to={`/`} title={'الرئيسية'} setShow={setShow} />
								<NavItem icon={'category'} to={`/products`} title={'المنتجات'} setShow={setShow} />
								<NavItem icon={'local_mall'} title={'السلة'} to={`/cart`} setShow={setShow}>
									{cart?.items?.length > 0 && (
										<span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
											{cart?.items?.length}
										</span>
									)}
								</NavItem>
								<NavItem icon={'list_alt'} title={'الطلبات'} to={`/orders`} setShow={setShow} />
							</>
						) : currentUser.role == 'admin' || currentUser.role == 'employee' ? (
							<>
								{/* Admin & Employee Links */}
								<NavItem
									icon={'fact_check'}
									title={'كل المنتجات'}
									to={`/dashboard/products`}
									setShow={setShow}
								/>
								<NavItem
									icon={'add'}
									title={'إنشاء منتج'}
									to={`/dashboard/create-product`}
									setShow={setShow}
								/>
								<NavItem
									icon={'reorder'}
									title={'كل الطلبات'}
									to={`/dashboard/all-orders`}
									setShow={setShow}
								/>
								<NavItem
									icon={'people'}
									title={'المستخدمين'}
									to={`/dashboard/users`}
									setShow={setShow}
								/>
							</>
						) : null}
					</>
				)}
				<NavItem icon={'info'} title={'من نحن'} to={'/about'} setShow={setShow} />
				<NavItem icon={'diversity_3'} title={'عملاؤنا'} to={'/our-clients'} setShow={setShow} />
			</ul>

			{/* Logo */}
			<Link to={'/'} className="p-1">
				<img src="/images/logo.svg" alt="logo" className="  h-full max-h-full object-contain" />
			</Link>
		</div>
	);
};

const NavItem = ({ to, icon, title, children, setShow }) => {
	const { pathname: path } = useLocation();
	return (
		<li className="navbar-item max-lg:p-4" data-isactive={path == to}>
			<Link
				to={to}
				className="flex items-center gap-2 max-lg:w-fit max-lg:mx-auto max-lg:justify-center"
				onClick={() => {
					if (setShow) setShow(false);
				}}
			>
				<i className="material-icons-round text-lg">{icon}</i>
				<span>{title}</span>
				{children}
			</Link>
		</li>
	);
};
