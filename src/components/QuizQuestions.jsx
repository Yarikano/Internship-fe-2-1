import { useSelector, useDispatch } from 'react-redux';
import { Space, Spin } from 'antd';
import { nextQuestion } from '../redux/slices/quizSLice';
import { useEffect, useState } from 'react';
import {
	doc,
	updateDoc,
	query,
	collection,
	onSnapshot
} from 'firebase/firestore';
import { addUserToQuiz, setUserReady } from '../redux/slices/quizSLice';
import { db } from '../firebase/firebase';
import { UserAuth } from '../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuizQuestions = ({ questions }) => {
	const dispatch = useDispatch();
	const { user, oponent, current } = UserAuth();
	const navigate = useNavigate();
	const { currentQuestion } = useSelector(state => state.quizSLice);
	console.log(useSelector(state => state.quizSLice.currentQuestion));
	console.log(currentQuestion);
	const [answers, setSnswers] = useState([]);
	const [disabled, setDisabled] = useState(false);
	console.log(current);
	useEffect(() => {
		if (questions.length > 0) {
			setSnswers([
				...questions[currentQuestion].incorect,
				questions[currentQuestion].correct
			]);
		}
	}, [currentQuestion, questions]);
	const randomAnswers = answers.sort((a, b) => a.length - b.length);

	const test = e => {
		if (e.target.id === atob(questions[currentQuestion].correct)) {
			e.target.className = 'correct';
			updateDoc(doc(db, 'usersQuiz', user.uid), {
				currentQuestion: current.currentQuestion + 1,
				correctAnswers: current.correctAnswers + 1
			});
		} else {
			e.target.className = 'incorrect';
			updateDoc(doc(db, 'usersQuiz', user.uid), {
				currentQuestion: current.currentQuestion + 1
			});
		}
		setDisabled(true);
	};
	const nextAnswer = () => {
		setDisabled(false);
		dispatch(nextQuestion());
	};
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
	}, [dispatch]);
	return (
		<>
			<div className='question-box' key={currentQuestion}>
				<h2
					onClick={() => {
						console.log(typeof currentQuestion);
					}}
				>
					<span> Question</span>
					<div>{`${currentQuestion + 1} / ${questions.length}`} </div>
				</h2>

				<div className='question-body'>
					<h3>
						{questions[currentQuestion] && questions.length !== 0 ? (
							atob(questions[currentQuestion].question)
						) : (
							<Space direction='vertical'>
								<Spin tip='Waiting for questions...'></Spin>
							</Space>
						)}
					</h3>
					{questions[currentQuestion] ? (
						<div className='answers-list'>
							{randomAnswers.map((item, index) => (
								<div className={disabled ? 'disable' : 'enable'} key={item}>
									<p
										className='answer'
										id={atob(item)}
										onClick={e => {
											test(e);
										}}
									>
										{atob(item)}
									</p>
								</div>
							))}
						</div>
					) : (
						''
					)}
				</div>
			</div>
			{disabled && currentQuestion + 1 !== 20 ? (
				<>
					{disabled && current ? (
						<div className='button-to-next'>
							{current &&
							current.currentQuestion &&
							current.currentQuestion <= oponent.currentQuestion ? (
								<button
									className='next'
									onClick={() => {
										nextAnswer();
									}}
								>
									Next Question
								</button>
							) : (
								<Space direction='vertical'>
									<Spin tip='Waiting for oponent...'></Spin>
								</Space>
							)}
						</div>
					) : (
						''
					)}
				</>
			) : (
				<div className='button-show-results'>
					{disabled ? (
						<div className='button-to-next'>
							{current &&
							current.currentQuestion &&
							current.currentQuestion <= oponent.currentQuestion ? (
								<button
									className='next'
									onClick={() => {
										navigate('/results');
									}}
								>
									Show Results
								</button>
							) : (
								<Space direction='vertical'>
									<Spin tip='Waiting for oponent...'></Spin>
								</Space>
							)}
						</div>
					) : (
						''
					)}
				</div>
			)}
		</>
	);
};

export default QuizQuestions;
