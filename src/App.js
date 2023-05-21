import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
// import { getCatsFetch } from './redux/slices/test';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PageNotFound from './components/PageNotFound';
import Main from './pages/Main';
import Login from './pages/Login';
import { fetchLocalStorage } from './redux/slices/localData';
import Register from './components/Register';
import Success from './components/Success';
import UserForm from './components/Form';
import Results from './components/Results';

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchLocalStorage());
		// eslint-disable-next-line
	}, []);
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Header />}>
					<Route index element={<Main />} />
					<Route path='/login' element={<Login />} />
					<Route path='/registration' element={<Register />} />
					<Route path='/success' element={<Success />} />
					<Route path='/form' element={<UserForm />} />
					<Route path='/results' element={<Results />} />
				</Route>
				<Route path='*' element={<PageNotFound />} />
			</Routes>
		</div>
	);
}

export default App;
