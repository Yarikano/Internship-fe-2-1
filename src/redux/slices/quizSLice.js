import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	usersInQuiz: [],
	isLoading: false,
	isUserReadyToStartQuiz: false,
	questionsList: [],
	currentQuestion: 0,
	startQuiz: false
};

export const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {
		questionsClear(state) {
			state.currentQuestion = 0;
		},
		nextQuestion(state) {
			if (state.currentQuestion === 19) {
				return;
			} else {
				state.currentQuestion = state.currentQuestion + 1;
			}
		},
		questionsFetch(state) {
			state.isLoading = true;
		},
		setUserReady: state => {
			state.isUserReadyToStartQuiz = true;
		},
		addUserToQuiz: (state, action) => {
			state.usersInQuiz = action.payload;
		},
		doNotReadyToQuiz: state => {
			state.isUserReadyToStartQuiz = false;
		},
		setStartQuiz(state) {
			state.startQuiz = true;
		},
		setDenyQuiz(state) {
			state.startQuiz = false;
		},
		setQuestions(state, action) {
			state.questionsList = action.payload;
			state.isLoading = false;
		},
		usersInQuizFilter(state, action) {
			state.usersInQuiz.filter(item => item.id !== action.payload);
		}
	}
});

export const {
	setUserReady,
	addUserToQuiz,
	doNotReadyToQuiz,
	setUsersIsReady,
	setQuestions,
	questionsFetch,
	nextQuestion,
	setStartQuiz,
	setDenyQuiz,
	questionsClear,
	removeUser,
	usersInQuizFilter
} = quizSlice.actions;
export default quizSlice.reducer;
