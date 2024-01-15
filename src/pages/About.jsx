import { motion } from 'framer-motion';

const About = () => {
	return (
		<section className="min-h-full-screen container flex flex-col max-md:gap-3 justify-center items-center py-3">
			<div>
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="w-fit p-2 bg-secondColor rounded-full"
				>
					<img
						src="/images/rafat amarneh.jpeg"
						alt="supervisor"
						className="w-[200px] h-[200px] object-cover rounded-full"
					/>
				</motion.div>
				<motion.h2
					initial={{ opacity: 0, x: 100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="text-center mt-2 font-semibold text-lg"
				>
					<span className="font-bold">Supervisor:</span> Dr.Rafat Amarneh
				</motion.h2>
			</div>

			<div className="w-full flex max-md:flex-col max-md:gap-3 items-center justify-evenly">
				<div>
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="w-fit p-2 bg-secondColor rounded-full"
					>
						<img
							src="/images/majd rayyan.jpeg"
							alt="supervisor"
							className="w-[200px] h-[200px] object-cover rounded-full"
						/>
					</motion.div>
					<motion.h2
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className="text-center mt-2 font-semibold text-lg"
					>
						Majd Rayyan{' '}
					</motion.h2>
				</div>

				<div>
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className="w-fit p-2 bg-secondColor rounded-full"
					>
						<img
							src="/images/osaid qasrawi.jpeg"
							alt="supervisor"
							className="w-[200px] h-[200px] object-cover rounded-full"
						/>
					</motion.div>
					<motion.h2
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.9 }}
						className="text-center mt-2 font-semibold text-lg"
					>
						Osaid Qasrawi
					</motion.h2>
				</div>
			</div>
		</section>
	);
};

export default About;
