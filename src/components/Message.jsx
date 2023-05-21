import { db } from '../firebase/firebase';
import { query, collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import SingleMessage from './SingleMessage';

const Message = () => {
	const [messages, setMessages] = useState([]);
	useEffect(() => {
		const q = query(collection(db, 'messages'));
		const unsubcribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			const sortedMess = array.sort((a, b) => a.dateId - b.dateId);
			setMessages(sortedMess);
		});

		return () => {
			unsubcribe();
		};
	}, []);
	const scroll = useRef();
	const scrollToBottom = () => {
		scroll.current.scrollTo(0, scroll.current.scrollHeight);
	};
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<>
			<div className='message-wrapper'>
				<ul
					className='message-list'
					ref={scroll}
					onChange={() => {
						scrollToBottom();
					}}
				>
					{messages.map(item => (
						<SingleMessage item={item} key={item.id} />
					))}
				</ul>
			</div>
		</>
	);
};

export default Message;
