import { useEffect } from 'react';
import { useClientContext } from '../context/ClientProvider';
import { useLoadingContext } from '../context/LoadingProvider';
import { motion } from 'framer-motion';

const OurClients = () => {
	const { getClients, clients } = useClientContext();
	const { withLoading, loading } = useLoadingContext();

	useEffect(() => {
		withLoading(() => getClients(), 'getClients');
	}, []);

	if (loading.getClients) return <h1 className="text-center text-3xl mt-12">جاري التحميل...</h1>;

	return (
		<section className="min-h-full-screen">
			<h1 className="text-center text-4xl my-8">عملاؤنا</h1>
			<div className="container my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{clients?.map((client, i) => (
					<motion.div
						key={client._id}
						className="border p-4 rounded shadow"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.1 }}
					>
						<img className="w-full h-64 object-cover rounded" src={client.image.url} alt={client.name} />
						<h2 className="mt-2 font-bold text-xl text-center">{client.name}</h2>
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default OurClients;
