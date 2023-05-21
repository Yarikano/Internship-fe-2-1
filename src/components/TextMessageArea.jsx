import { useRef } from 'react';
import { db } from '../firebase/firebase';
import { addDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { UserAuth } from '../firebase/AuthContext';
import { Button } from 'antd';
const TextMessageArea = () => {
	const [messDate, setMessDate] = useState('');
	const [messTime, setMessTime] = useState('');
	const { user } = UserAuth();
	const [curUser, setCurUser] = useState({});
	const textarea = useRef();

	useEffect(() => {
		setInterval(() => {
			const date = new Date();
			const hours =
				date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
			const minutes =
				date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			const seconds =
				date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			setMessTime(`${hours}:${minutes}:${seconds}`);
		}, 100);
	}, []);
	useEffect(() => {
		setInterval(() => {
			const date = new Date();
			const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			const month =
				date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
			const year =
				date.getFullYear() < 10 ? '0' + date.getFullYear() : date.getFullYear();
			setMessDate(`${day}/${month}/${year}`);
		}, 100);
	}, []);

	const placeholder = 'Enter your message';
	useEffect(() => {
		const q = query(collection(db, 'users'));
		const unsubcribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			// eslint-disable-next-line
			array.filter(userData => {
				if (user && userData.id === user.uid) {
					setCurUser(userData);
				}
			});
		});
		return () => {
			unsubcribe();
		};
		// eslint-disable-next-line
	}, [user]);
	const setMess = async () => {
		if (textarea.current.value !== '') {
			await addDoc(collection(db, 'messages'), {
				userName: curUser.name,
				image: curUser.image,
				value: textarea.current.value,
				date: messDate,
				time: messTime,
				dateId: Date.now(),
				user: user.uid
			});
			textarea.current.value = '';
		} else {
			return;
		}
	};

	const enterKeyDown = e => {
		if (e.target.value === '') {
			return;
		} else if (e.key === 'Enter') {
			setMess();
			e.preventDefault();
			return;
		}
	};
	const onKeyUp = e => {
		if (e.key === 'Enter') {
			textarea.current.value = '';
		}
	};
	return (
		<>
			<div className='text-area'>
				<form>
					{!user ? (
						<textarea
							disabled
							className='message-text-area'
							ref={textarea}
							placeholder={'You need to be logged in to write messages.'}
							onKeyDown={enterKeyDown}
						></textarea>
					) : (
						<textarea
							className='message-text-area'
							ref={textarea}
							placeholder={placeholder}
							onKeyDown={enterKeyDown}
							onKeyUp={onKeyUp}
						></textarea>
					)}
					<Button type='primary' onClick={setMess} className='button'>
						Send Message
					</Button>
				</form>
			</div>
		</>
	);
};

export default TextMessageArea;
