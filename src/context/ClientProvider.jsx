/* eslint-disable */
import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useUserContext } from './UserProvider';

const ClientContext = createContext(null);

const ClientProvider = ({ children }) => {
	const { currentUser } = useUserContext();

	const [clients, setClients] = useState([]);
	const [currentClient, setCurrentClient] = useState({});

	async function getClients(callback) {
		try {
			const { data, status } = await axios.get(`/api/clients`, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (status == 200) {
				setClients(data.clients);
				callback && callback(data);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	}
	async function getSingle(clientId, callback) {
		try {
			const { data, status } = await axios.get(`/api/clients/${clientId}`, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (status == 200) {
				setCurrentClient(data.client);
				callback && callback(data);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	}
	async function updateClient(clientId, infos, callback) {
		try {
			const { data, status } = await axios.put(`/api/clients/${clientId}`, infos, {
				headers: {
					'Content-Type': 'multipart/form',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			});
			if (status == 200) {
				setClients(prev => prev.map(item => (item._id == clientId ? data.client : item)));
				callback && callback(data);
				toast.success(data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	}
	async function deleteClient(clientId, callback) {
		try {
			const { data, status } = await axios.delete(`/api/clients/${clientId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			});
			if (status == 200) {
				setClients(prev => prev.filter(item => item._id !== clientId));
				callback && callback(data);
				toast.success(data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	}
	async function createClient(infos, callback) {
		try {
			const { data, status } = await axios.post(`/api/clients`, infos, {
				headers: {
					'Content-Type': 'multipart/form',
					Authorization: 'Bearer ' + currentUser?.token,
				},
			});
			if (status == 201) {
				setClients(prev => [...prev, data.client]);
				callback && callback(data);
				toast.success(data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	}

	return (
		<ClientContext.Provider
			value={{
				clients,
				setClients,
				updateClient,
				deleteClient,
				createClient,
				getClients,
				getSingle,
				currentClient,
				setCurrentClient,
			}}
		>
			{children}
		</ClientContext.Provider>
	);
};

export default ClientProvider;

export const useClientContext = () => {
	const {
		clients,
		setClients,
		updateClient,
		deleteClient,
		createClient,
		getClients,
		getSingle,
		currentClient,
		setCurrentClient,
	} = useContext(ClientContext);
	return {
		clients,
		setClients,
		updateClient,
		deleteClient,
		createClient,
		getClients,
		getSingle,
		currentClient,
		setCurrentClient,
	};
};
