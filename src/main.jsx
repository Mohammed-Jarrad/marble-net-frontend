import axios from 'axios';
import 'material-icons/iconfont/material-icons.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import CartProvider from './context/CartProvider.jsx';
import CommentsProvider from './context/CommentsProvider.jsx';
import LoadingProvider from './context/LoadingProvider.jsx';
import ProductsProvider from './context/ProductsProvider.jsx';
import RatingProvider from './context/RatingProvider.jsx';
import UserProvider from './context/UserProvider.jsx';
import './index.css';
import OrderProvider from './context/OrderProvider.jsx';
import ClientProvider from './context/ClientProvider.jsx';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<LoadingProvider>
			<UserProvider>
				<CartProvider>
					<ProductsProvider>
						<OrderProvider>
							<CommentsProvider>
								<RatingProvider>
									<ClientProvider>
										<App />
									</ClientProvider>
								</RatingProvider>
							</CommentsProvider>
						</OrderProvider>
					</ProductsProvider>
				</CartProvider>
			</UserProvider>
		</LoadingProvider>
	</BrowserRouter>,
);
