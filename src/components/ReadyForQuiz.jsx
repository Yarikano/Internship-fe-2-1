import { useSelector } from 'react-redux';
import { useRef, useEffect, useState } from 'react';
import {
	setUserReady,
	doNotReadyToQuiz,
	addUserToQuiz,
	questionsFetch
} from '../redux/slices/quizSLice';
import { useDispatch } from 'react-redux';
import {
	query,
	collection,
	onSnapshot,
	setDoc,
	doc,
	deleteDoc,
	updateDoc,
	addDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getUsersSuccess } from '../redux/slices/users';
import { Space, Spin } from 'antd';
const ReadyForQuiz = () => {
	const [ready, setReady] = useState(false);
	const { usersInQuiz, questionsList } = useSelector(state => state.quizSLice);
	const { users } = useSelector(state => state.users);
	const { user } = useSelector(state => state.localData);
	const readyCheckboxRef = useRef();
	const dispatch = useDispatch();
	const deleteUser = async () => {
		updateDoc(doc(db, 'usersQuiz', user.uid), {
			lider: false
		});
		await deleteDoc(doc(db, 'usersQuiz', user.uid));
	};

	const [currentUser, setCurrentUser] = useState({});
	const showButtons = () => {
		if (readyCheckboxRef.current.checked) {
			if (usersInQuiz.length === 0) {
				users.forEach(item => {
					if (item.id === user.uid) {
						localStorage.setItem('show', true);
						const newUser = doc(db, 'usersQuiz', user.uid);
						getStorageData();
						setDoc(newUser, {
							name: item.name,
							id: item.id,
							isReady: false,
							correctAnswers: 0,
							lider: true,
							currentQuestion: 1
						});
					}
				});
			} else {
				users.forEach(item => {
					if (item.id === user.uid) {
						localStorage.setItem('show', true);
						const newUser = doc(db, 'usersQuiz', user.uid);
						getStorageData();
						setDoc(newUser, {
							name: item.name,
							id: item.id,
							isReady: false,
							correctAnswers: 0,
							lider: false,
							currentQuestion: 1
						});
					}
				});
			}
		}
	};
	const addQuestions = () => {
		questionsList.forEach((item, index) => {
			addDoc(collection(db, 'questions'), {
				category: item.category,
				correct: item.correct_answer,
				difficulty: item.difficulty,
				incorect: item.incorrect_answers,
				question: item.question,
				type: item.type,
				questionNumber: index
			});
		});
	};
	useEffect(() => {
		dispatch(questionsFetch());
		// eslint-disable-next-line
	}, []);
	const readyUser = async () => {
		if (currentUser.lider === true) {
			addQuestions();
		}
		const curUser = doc(db, 'usersQuiz', user.uid);
		updateDoc(curUser, {
			isReady: true
		});
	};
	useEffect(() => {
		const q = query(collection(db, 'users'));
		const unsubcribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			dispatch(getUsersSuccess(array));
		});
		return () => {
			unsubcribe();
		};
		// eslint-disable-next-line
	}, []);
	useEffect(() => {
		const q = query(collection(db, 'usersQuiz'));
		const unsubcribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			dispatch(addUserToQuiz(array));
			if (array.length === 2) {
				dispatch(setUserReady());
			}
		});
		return () => {
			unsubcribe();
		};
		// eslint-disable-next-line
	}, []);
	const getStorageData = () => {
		const getLocalStorage = localStorage.getItem('show');
		const bool = JSON.parse(getLocalStorage);
		return bool;
	};
	useEffect(() => {
		setReady(getStorageData());
		// eslint-disable-next-line
	}, [getStorageData()]);
	useEffect(() => {
		usersInQuiz.forEach(item => {
			if (user && item.id === user.uid) {
				setCurrentUser(item);
			}
		});
	}, [user, usersInQuiz]);
	return (
		<>
			{!ready ? (
				<>
					<h2>Are You Ready For Quiz?</h2>
					<div className='redy-box'>
						<label htmlFor='ready' className='ready'>
							Ready
						</label>
						<input
							ref={readyCheckboxRef}
							type='checkbox'
							id='ready'
							onChange={() => {
								showButtons();
							}}
						/>
					</div>
				</>
			) : (
				<div className='start-buttons'>
					{!currentUser.isReady ? (
						<>
							<button
								className='start'
								onClick={() => {
									readyUser();
								}}
							>
								START
							</button>
							<button
								className='cancel'
								onClick={() => {
									localStorage.setItem('show', false);
									deleteUser();
									dispatch(doNotReadyToQuiz());
								}}
							>
								CANCEL
							</button>
						</>
					) : (
						<>
							<Space direction='vertical'>
								<Spin tip='Waiting for oponent...'></Spin>
							</Space>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default ReadyForQuiz;
