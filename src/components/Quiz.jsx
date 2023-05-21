import ReadyForQuiz from './ReadyForQuiz';
import { useSelector, useDispatch } from 'react-redux';
import {} from '../redux/slices/quizSLice';
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { UserAuth } from '../firebase/AuthContext';
import QuizQuestions from './QuizQuestions';
import { addUserToQuiz } from '../redux/slices/quizSLice';
import { Space, Spin } from 'antd';

const Quiz = ({ notInGame }) => {
	const dispatch = useDispatch();
	const { oponent, current } = UserAuth();
	const [questions, setQuestions] = useState([]);

	const { usersInQuiz } = useSelector(state => state.quizSLice);
	const start = () => {
		if (usersInQuiz[0] !== undefined && usersInQuiz[1] !== undefined) {
			const start =
				usersInQuiz[0].isReady === true && usersInQuiz[1].isReady === true;
			return start;
		}
	};
	useEffect(() => {
		start();
		//eslint-disable-next-line
	}, []);
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
			dispatch(addUserToQuiz(array));
		});

		return () => {
			unsubcribe();
		};
	}, [dispatch]);

	return (
		<>
			<div className='quiz-wrapper'>
				{notInGame ? (
					<Space direction='vertical'>
						<Spin tip='Waiting for games end...'></Spin>
					</Space>
				) : (
					<>
						<div className='quiz-body'>
							{!start() ? (
								<ReadyForQuiz />
							) : (
								<div className='quiz-start'>
									<QuizQuestions questions={questions} currentUser={current} />
								</div>
							)}
						</div>
						<div className='quiz-info'>
							{start() ? (
								<>
									<div className='first-user'>
										<span className='user-name'>{current && current.name}</span>
									</div>
									<div className='score'>
										<span className='user-score'>
											{current && current.correctAnswers}
										</span>
										<span>:</span>
										<span className='user-score'>
											{oponent && oponent.correctAnswers}
										</span>
									</div>
									<div className='second-user'>
										<span className='user-name'>{oponent && oponent.name}</span>
									</div>
								</>
							) : (
								''
							)}
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default Quiz;
