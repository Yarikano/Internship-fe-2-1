import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootSaga from './saga/rootSaga';
import test from './slices/test';
import localData from './slices/localData';
import quizSLice from './slices/quizSLice';
import users from './slices/users';

import createSagaMiddlware from 'redux-saga';

const sagaMiddleware = createSagaMiddlware();
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({
	reducer: {
		test,
		localData,
		quizSLice,
		users
	},
	middleware
});
sagaMiddleware.run(rootSaga);

export default store;
