import { storage } from './firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

const storageRef = ref(storage, 'users-image');
const getImageURL = async filePath => {
	const url = await getDownloadURL(ref(storage, filePath));
	return url;
};

const listFiles = async folder => {
	const res = await listAll(storageRef);
	const list = res.items.map(itemRef => itemRef._location.path_);
	return list;
};

const StorageService = {
	getImageURL,
	listFiles
};

export default StorageService;
