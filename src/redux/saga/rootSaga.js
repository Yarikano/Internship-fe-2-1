import { put, takeEvery } from 'redux-saga/effects';
import { fetchSuccess } from '../slices/localData';
import { setQuestions } from '../slices/quizSLice';

function* workGetLocalFetch() {
	const data = yield localStorage.getItem('user');
	const dataJson = yield JSON.parse(data);
	yield put(fetchSuccess(dataJson));
}

function* workGetApiFetch() {
	const data = yield fetch(
		'https://opentdb.com/api.php?amount=20&encode=base64'
	).then(resp => resp.json());
	yield put(setQuestions(data.results));
}

function* getLocalStorageSaga() {
	yield takeEvery('localData/fetchLocalStorage', workGetLocalFetch);
	yield takeEvery('quiz/questionsFetch', workGetApiFetch);
}

export default getLocalStorageSaga;
