/* eslint-disable */

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useClientContext } from '../context/ClientProvider';
import { useLoadingContext } from '../context/LoadingProvider';
import toast from 'react-hot-toast';

const AdminClients = () => {
	const { loading, withLoading } = useLoadingContext();
	const { getClients, clients } = useClientContext();
	const [openCreate, setOpenCreate] = useState(false);

	useEffect(() => {
		withLoading(() => getClients(), 'getClients');
	}, []);

	if (loading.getClients) return <h1 className="text-center text-3xl mt-12">جاري التحميل...</h1>;
	else if (loading.getClients == undefined) return null;

	return (
		<section className="container my-12">
			<button
				className="custom-button bg-mainColor flex items-center justify-center"
				onClick={() => setOpenCreate(prev => !prev)}
			>
				<i className="material-icons-round">add</i>
			</button>

			<div className="relative overflow-x-auto mt-7 w-full shadow-xl rounded mb-5">
				<table className="w-full text-right text-sm max-sm:text-[12px]">
					<thead className="bg-secondColor text-white">
						<tr>
							<th className="px-6 py-3">الرقم</th>
							<th className="px-6 py-3">الاسم</th>
							<th className="px-6 py-3">الصورة</th>
							<th className="px-2 py-3">المزيد</th>
						</tr>
					</thead>
					<tbody>
						{clients?.map((client, i) => (
							<ClientRecord key={client._id} client={client} i={i} />
						))}
					</tbody>
				</table>
			</div>

			<CreateModal open={openCreate} setOpen={setOpenCreate} />
		</section>
	);
};

export default AdminClients;

const ClientRecord = ({ client, i }) => {
	const [open, setOpen] = useState(false);
	const { setCurrentClient, deleteClient } = useClientContext();
	const handleDelete = clientId => {
		Swal.fire({
			title: 'هل أنت متأكد؟',
			text: 'لن تستطيع إعادة هذا الزبون!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--main-color)',
			cancelButtonText: 'إلغاء',
			confirmButtonText: 'نعم، متأكد!',
			iconColor: 'red',
			cancelButtonColor: 'var(--red-color)',
		}).then(result => {
			if (result.isConfirmed) {
				deleteClient(clientId);
			}
		});
	};
	return (
		<tr className="relative bg-white border-b hover:bg-gray-50">
			<td className="py-3 px-6">{i + 1}</td>
			<td className="py-3 px-6">{client.name}</td>
			<td className="py-3 px-6">
				<img className="w-16 h-16 rounded-full object-cover" src={client.image.url} alt={client.name} />
			</td>
			<td className="py-3 px-2">
				<div className="flex items-center gap-2">
					<button
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => handleDelete(client._id)}
					>
						Delete
					</button>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => {
							setCurrentClient(client);
							setOpen(prev => !prev);
						}}
					>
						Update
					</button>
					<UpdateModal open={open} setOpen={setOpen} />
				</div>
			</td>
		</tr>
	);
};

const UpdateModal = ({ open, setOpen }) => {
	const { loading, withLoading } = useLoadingContext();
	const { currentClient, updateClient } = useClientContext();

	const [file, setFile] = useState(null);
	const [name, setName] = useState('');
	const [imageUrl, setImageUrl] = useState(currentClient?.image?.url || '');

	useEffect(() => {
		setName(currentClient?.name);
		setImageUrl(currentClient?.image?.url || '');
	}, [currentClient]);

	useEffect(() => {
		if (file) {
			setImageUrl(URL.createObjectURL(file));
		}
	}, [file]);

	const handleUpdate = e => {
		e.preventDefault();
		const formData = new FormData();
		name !== currentClient?.name && formData.append('name', name);
		file && formData.append('image', file);
		withLoading(
			() =>
				updateClient(currentClient?._id, formData, data => {
					setOpen(false);
				}),
			'updateClient',
		);
	};

	return (
		<Modal open={open} setOpen={setOpen}>
			<form className="flex flex-col items-stretch justify-center gap-3" onSubmit={handleUpdate}>
				<div className="flex flex-col gap-1">
					<label htmlFor="name">الاسم</label>
					<input
						className="form-input"
						id="name"
						type="text"
						placeholder="name..."
						defaultValue={name}
						onChange={e => setName(e.target.value)}
					/>
				</div>
				<img
					src={imageUrl}
					alt="client"
					className="w-[200px] h-[200px] object-cover max-w-full mx-auto"
				/>

				<label htmlFor="file" className="!text-black border w-fit custom-button cursor-pointer">
					اختار صورة
				</label>
				<input type="file" id="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
				<button type="submit" className="custom-button bg-mainColor">
					{loading.updateClient ? <LoadingSpinner /> : 'تعديل الزبون'}
				</button>
			</form>
		</Modal>
	);
};

const CreateModal = ({ open, setOpen }) => {
	const { loading, withLoading } = useLoadingContext();
	const { createClient } = useClientContext();

	const [file, setFile] = useState(null);
	const [name, setName] = useState('');

	const handleCreate = e => {
		e.preventDefault();
		if (!file) {
			return toast.error('اضف صورة');
		}
		const formData = new FormData();
		formData.append('name', name);
		formData.append('image', file);
		withLoading(
			() =>
				createClient(formData, data => {
					console.log(data);
					setOpen(false);
				}),
			'createClient',
		);
	};

	return (
		<Modal open={open} setOpen={setOpen}>
			<form className="flex flex-col items-stretch justify-center gap-3" onSubmit={handleCreate}>
				<div className="flex flex-col gap-1">
					<label htmlFor="name">الاسم</label>
					<input
						className="form-input"
						id="name"
						type="text"
						placeholder="name..."
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</div>
				<img
					src={file ? URL.createObjectURL(file) : '/images/defaultProduct.png'}
					alt="client"
					className="w-[200px] h-[200px] object-cover max-w-full mx-auto"
				/>
				<label htmlFor="create" className="!text-black border w-fit custom-button cursor-pointer">
					اختار صورة
				</label>
				<input type="file" id="create" className="hidden" onChange={e => setFile(e.target.files[0])} />
				<button type="submit" className="custom-button bg-mainColor">
					{loading.createClient ? <LoadingSpinner /> : 'انشاء زبون'}
				</button>
			</form>
		</Modal>
	);
};
