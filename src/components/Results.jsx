import { useEffect, useState } from 'react';
import {
	query,
	collection,
	onSnapshot,
	deleteDoc,
	doc,
	updateDoc,
	setDoc
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { UserAuth } from '../firebase/AuthContext';
import { db } from '../firebase/firebase';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { questionsClear, usersInQuizFilter } from '../redux/slices/quizSLice';
const Results = () => {
	const [current, setCurrent] = useState({});
	const [oponent, setOponent] = useState({});
	const [questions, setQuestions] = useState([]);
	const { user } = UserAuth();

	const { usersInQuiz } = useSelector(state => state.quizSLice);
	console.log(usersInQuiz);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	useEffect(() => {
		const q = query(collection(db, 'questions'));
		const unsubcribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			const sortQuest = array.sort(
				(a, b) => a.questionNumber - b.questionNumber
			);
			setQuestions(sortQuest);
		});
		return () => {
			unsubcribe();
		};
	}, []);
	useEffect(() => {
		const q = query(collection(db, 'usersQuiz'));
		const unsubcribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			array.forEach(item => {
				if (item.id === user.uid) {
					setCurrent(item);
				} else {
					setOponent(item);
				}
			});
		});
		return () => {
			unsubcribe();
		};
	}, [user]);
	const del = () => {
		questions.forEach(async (item, index) => {
			if (index > 19) {
			}
			await deleteDoc(doc(db, 'questions', item.id));
		});
	};
	const endGame = () => {
		dispatch(usersInQuizFilter(user && user.uid));
		const results = doc(db, 'results', user.uid);
		setDoc(results, {
			result: current.correctAnswers
		});
		dispatch(questionsClear());
		localStorage.setItem('show', false);
		del();
		const userIsReady = doc(db, 'usersQuiz', user.uid);
		updateDoc(userIsReady, {
			isRaedy: false
		});
		deleteDoc(doc(db, 'usersQuiz', user.uid));
		navigate('/');
	};
	return (
		<>
			<div className='results-wrapper'>
				<h2>Results:</h2>
				<div className='results-box'>
					{current.correctAnswers > oponent.correctAnswers ? (
						<div className='you-win'>
							<h2>You WIN</h2>
							<span>{current.name}</span>
							<span className='colon'>:</span>
							<span>{current.correctAnswers}</span>
						</div>
					) : current.correctAnswers < oponent.correctAnswers ? (
						<div className='you-lost'>
							<h2>You LOST</h2>
							<span>{current.name}</span>
							<span className='colon'>:</span>
							<span>{current.correctAnswers}</span>
						</div>
					) : current.correctAnswers === oponent.correctAnswers ? (
						<div className='draw'>
							<h2>It is DRAW</h2>
							<div className='user-box'>
								<div className='user'>
									<span>{current.name}</span>
									<span>{current.correctAnswers}</span>
								</div>
								<span className='colon'>:</span>
								<div className='user'>
									<span>{oponent.correctAnswers}</span>
									<span>{oponent.name}</span>
								</div>
							</div>
						</div>
					) : (
						''
					)}
					<span></span>
				</div>
			</div>
			<Space>
				<Button
					type='primary'
					className='end-game'
					onClick={() => {
						endGame();
					}}
				>
					Okay
				</Button>
			</Space>
		</>
	);
};

export default Results;
