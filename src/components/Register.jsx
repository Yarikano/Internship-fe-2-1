import { useEffect, useState, useRef } from 'react';
import { query, collection, onSnapshot } from 'firebase/firestore';
import { UserAuth } from '../firebase/AuthContext';
import { db } from '../firebase/firebase';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchLocalStorage } from '../redux/slices/localData';

const Register = () => {
	const { userUid, createUser } = UserAuth();
	useEffect(() => {
		const q = query(collection(db, 'users'));
		let array = [];
		const unsubcribe = onSnapshot(q, queryCollection => {
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
		});
		const userAtDb = array.filter(item => item.id === userUid);
		console.log(userAtDb);
		return () => {
			unsubcribe();
		};
	}, [userUid]);
	const formItemLayout = {
		labelCol: {
			xs: {
				span: 24
			},
			sm: {
				span: 8
			}
		},
		wrapperCol: {
			xs: {
				span: 24
			},
			sm: {
				span: 16
			}
		}
	};
	const tailFormItemLayout = {
		wrapperCol: {
			xs: {
				span: 24,
				offset: 0
			},
			sm: {
				span: 16,
				offset: 8
			}
		}
	};
	const [form] = Form.useForm();
	const onFinish = values => {
		console.log('Received values of form: ', values);
	};
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [error, setError] = useState('');
	const password1Ref = useRef();
	const password2Ref = useRef();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleSubmit = async e => {
		e.preventDefault();
		setError('');
		try {
			if (password1 !== password2) {
				return;
			} else if (password1 === '') {
				return;
			} else if (password2 === '') {
				return;
			} else {
				await createUser(email, password1);
				dispatch(fetchLocalStorage());
				navigate('/form');
			}
		} catch (e) {
			setError(e.message);
			console.log(e.message, error);
		}
	};

	return (
		<>
			<div className='background'>
				<Form
					{...formItemLayout}
					form={form}
					name='register'
					onFinish={onFinish}
					onSubmit={handleSubmit}
					scrollToFirstError
				>
					<Form.Item
						name='email'
						label='E-mail'
						rules={[
							{
								type: 'email',
								message: 'The input is not valid E-mail!'
							},
							{
								required: true,
								message: 'Please input your E-mail!'
							}
						]}
					>
						<Input
							onChange={e => {
								setEmail(e.target.value);
							}}
						/>
					</Form.Item>
					<Form.Item
						name='password'
						label='Password'
						rules={[
							{
								required: true,
								message: 'Please input your password!'
							}
						]}
						hasFeedback
					>
						<Input.Password
							ref={password1Ref}
							onChange={e => {
								setPassword1(e.target.value);
							}}
						/>
					</Form.Item>
					<Form.Item
						name='confirm'
						label='Confirm Password'
						dependencies={['password']}
						hasFeedback
						rules={[
							{
								required: true,
								message: 'Please confirm your password!'
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error(
											'The two passwords that you entered do not match!'
										)
									);
								}
							})
						]}
					>
						<Input.Password
							ref={password2Ref}
							onChange={e => {
								setPassword2(e.target.value);
							}}
						/>
					</Form.Item>
					<Form.Item {...tailFormItemLayout} className='register-buttons'>
						<Button type='primary' htmlType='submit' onClick={handleSubmit}>
							Register
						</Button>
						<Button>
							<Link to='/'>
								Go to Home
								<HomeOutlined />
							</Link>
						</Button>
					</Form.Item>
				</Form>
			</div>
		</>
	);
};

export default Register;
