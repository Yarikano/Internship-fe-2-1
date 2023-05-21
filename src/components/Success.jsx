import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../firebase/AuthContext';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Success = () => {
	const navigate = useNavigate();
	const { user } = UserAuth();
	const addUser = () => {
		if (user) {
			const newUser = doc(db, 'users', user.uid);
			setDoc(newUser, {
				name: 'User',
				image: '/users-image/default.webp'
			});
			console.log(user);
			navigate('/');
		}
	};
	return (
		<Result
			status='success'
			title='Registration was SUCCESS'
			subTitle=''
			extra={[
				<Button type='primary' key='console' onClick={addUser}>
					Go To Home
				</Button>
			]}
		/>
	);
};
export default Success;
