import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<div className="relative" style={{ height: 'calc(100vh - 50px)' }}>
			<motion.img
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				src="/images/home-bg.jpg"
				alt="home"
				className="h-full w-full -z-10 absolute inset-0 object-cover"
			/>
			<div className="absolute inset-0 bg-black/10 -z-10"></div>

			<div className="container h-full overflow-hidden z-[999]">
				<motion.p
					initial={{ opacity: 0, x: -200 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="mt-10 md:mt-36 text-lg md:text-2xl leading-10"
				>
					يمثل بداية عصر جديد في تجارة{' '}
					<span className="text-2xl bg-secondColor text-white p-1 rounded-md inline-block">
						الرخام الالكترونية
					</span>{' '}
				</motion.p>
				<motion.p
					initial={{ opacity: 0, y: -200 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="max-w-2xl text-lg md:text-2xl leading-10"
				>
					وهو موقع ويب متخصص في بيع الشايش والرخام الطبيعي والصناعي والبورسلان، يهدف الى توفير منصة سلسة
					وسهلة الاستخدام تمكن العملاء من الاطلاع على تشكيلة واسعة من منتجات الرخام بكل سهولة واختيار
					الرخام المناسب .
				</motion.p>
				<motion.p
					initial={{ opacity: 0, x: 200 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="max-w-2xl md:mt-7 text-lg md:text-xl leading-10 md:font-semibold"
				>
					نسعى في هذا المشروع لتحقيق تجربة تسوق إلكترونية متكاملة لكل من يبحث عن منتجات الرخام بجوده
					عالية من دول مختلفة.
				</motion.p>
				<motion.div
					initial={{opacity: 0, scale: 0}}
					animate={{opacity: 1, scale: 1}}
					transition={{duration: 0.7}}
					className="w-fit"
				>
					<Link
						to={'/products'}
						className="mt-3 inline-block md:mt-7 border-2 rounded-md border-secondColor text-xl w-fit py-2 px-16 hover:bg-secondColor hover:text-white transition-all"
					>
						إبدأ
					</Link>
				</motion.div>
			</div>
		</div>
	);
};

export default Home;
