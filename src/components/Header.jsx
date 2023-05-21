import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { UserAuth } from '../firebase/AuthContext';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { fetchLocalStorage } from '../redux/slices/localData';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Header = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { logout, user } = UserAuth();
	const deleteUser = () => {
		deleteDoc(doc(db, 'usersQuiz', user.uid));
	};
	const logOut = () => {
		deleteUser();
		localStorage.setItem('show', false);
		logout();
		dispatch(fetchLocalStorage());
		navigate('/');
	};
	return (
		<>
			<header className='header'>
				<div className='header-nav'>
					<Link to='/' className='logo'>
						<img src='logo.png' alt='' />
					</Link>
					{!user ? (
						<Button>
							<Link to='/login'>Login</Link>
						</Button>
					) : (
						<Button onClick={logOut}>
							<UserOutlined />
							Log Out
						</Button>
					)}
				</div>
			</header>
			<Outlet />
		</>
	);
};

export default Header;
