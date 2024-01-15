import { Link } from 'react-router-dom';

const Footer = () => {
	const socials = [
		{
			name: 'واتس أب',
			src: '/images/whatsapp.svg',
			to: 'https://www.whatsapp.com',
		},
		{
			name: 'فيس بوك',
			src: '/images/facebook.svg',
			to: 'https://www.facebook.com',
		},
		{
			name: 'انستغرام',
			src: '/images/instagram.svg',
			to: 'https://www.instagram.com',
		},
		{
			name: 'البريد الالكتروني',
			src: '/images/gmail.svg',
			to: 'https://www.google.com',
		},
	];
	const links = [
		{
			name: 'الرئيسية',
			to: '/',
		},
		{
			name: 'من نحن',
			to: '/about',
		},
		{
			name: 'عملاؤنا',
			to: '/our-clients',
		},
		{
			name: 'منتجاتنا',
			to: '/products',
		},
	];

	return (
		<footer className="p-5 border-t">
			<div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Logo */}
				<div className="flex justify-center">
					<Link to={'/'} className="p-1">
						<img src="/images/logo.svg" alt="logo" className="w-32 md:w-60" />
					</Link>
				</div>

				{/* Social Links */}
				<div >
					<h2 className="font-bold text-xl mb-4 text-center">تابعنا</h2>
					<ul className="space-y-2 flex flex-col items-center">
						{socials.map((social, i) => (
							<li key={i}>
								<a
									href={social.to}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center space-x-2 hover:text-gray-600"
								>
									<img src={social.src} alt={social.name} className="w-6 h-6 object-cover ml-2" />
									<span>{social.name}</span>
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Page Links */}
				<div>
					<h2 className="font-bold text-xl mb-4 text-center">روابط سريعة</h2>
					<ul className="space-y-2 flex flex-col items-center">
						{links.map((link, i) => (
							<li key={i}>
								<Link to={link.to} className="hover:text-gray-600 hover:underline">
									{link.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Copyright */}
			<div className="text-center mt-12">
				<p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة</p>
			</div>
		</footer>
	);
};

export default Footer;
