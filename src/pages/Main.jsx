import Chat from '../components/Chat';
import LoginForm from '../components/LoginForm';
import Quiz from '../components/Quiz';
import { UserAuth } from '../firebase/AuthContext';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchLocalStorage } from '../redux/slices/localData';

const Main = () => {
	const { user, current, oponent } = UserAuth();
	const { usersInQuiz } = useSelector(state => state.quizSLice);
	const [userNotInGame, setUserNotInGame] = useState(false);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchLocalStorage());
		// eslint-disable-next-line
	}, []);
	useEffect(() => {
		if (usersInQuiz.length === 2) {
			setUserNotInGame(
				oponent &&
					current &&
					user &&
					usersInQuiz.length === 2 &&
					user.uid !== current.id &&
					user.uid !== oponent.id
			);
		} else {
			setUserNotInGame(false);
		}
	}, [current, oponent, user, usersInQuiz.length]);

	return (
		<>
			<main className='main'>
				{user ? (
					<>
						<Quiz notInGame={userNotInGame} />
						{/* <Quiz /> */}
						{/* <div className='quiz-wrapper'>
							<div className='quiz-body'>
								<Space direction='vertical'>
									<Spin tip='Wait for the end of the game...'></Spin>
								</Space>
							</div>
						</div> */}
						<Chat />
					</>
				) : (
					<LoginForm />
				)}
			</main>
		</>
	);
};

export default Main;
