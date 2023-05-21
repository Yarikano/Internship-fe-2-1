import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../firebase/AuthContext';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLocalStorage } from '../redux/slices/localData';
import { GoogleButton } from 'react-google-button';

const LoginForm = () => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [messageApi, contextHolder] = message.useMessage();
	const info = () => {
		messageApi.error('Invalid User or password');
	};
	const { signIn, googleSignIn, user, users } = UserAuth();
	const navigate = useNavigate();
	const handleSubmit = async e => {
		e.preventDefault();
		setError('');
		try {
			await signIn(email, password);
			dispatch(fetchLocalStorage());
			navigate('/');
		} catch (e) {
			setError(e.message);
			console.log(error);
			info();
		}
	};
	const handleGoogleSignIN = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			console.log(error);
		}
	};
	const usersId = users.map(item => item.id);
	useEffect(() => {
		if (user) {
			if (usersId.includes(user.uid)) {
				navigate('/');
			} else {
				navigate('/form');
			}
		} else {
			navigate('/login');
		}

		// eslint-disable-next-line
	}, [user, users]);

	return (
		<div className='login-foarm-wrapper'>
			{contextHolder}
			<div className='login-form login-bg'>
				<Form
					onSubmitCapture={handleSubmit}
					name='normal_login'
					className='login-form'
					initialValues={{
						remember: true
					}}
				>
					<Form.Item
						name='username'
						rules={[
							{
								required: true,
								message: 'Please input your Username!'
							}
						]}
					>
						<Input
							prefix={<UserOutlined className='site-form-item-icon' />}
							placeholder='Username'
							onChange={e => setEmail(e.target.value)}
						/>
					</Form.Item>
					<Form.Item
						name='password'
						rules={[
							{
								required: true,
								message: 'Please input your Password!'
							}
						]}
					>
						<Input
							prefix={<LockOutlined className='site-form-item-icon' />}
							type='password'
							placeholder='Password'
							onChange={e => setPassword(e.target.value)}
						/>
					</Form.Item>
					<Form.Item>
						<Form.Item name='remember' valuePropName='checked' noStyle>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>
					</Form.Item>

					<Form.Item className='login-buttons'>
						<Button
							type='primary'
							htmlType='submit'
							className='login-form-button '
						>
							Log in
						</Button>{' '}
						<Button type='primary'>
							<Link to='/registration'>Register</Link>
						</Button>
					</Form.Item>
					<GoogleButton onClick={handleGoogleSignIN} />
				</Form>
			</div>
		</div>
	);
};
export default LoginForm;
