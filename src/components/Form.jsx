import { Button, Form, Input, InputNumber, message } from 'antd';
import { db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../firebase/AuthContext';
import { useEffect, useRef } from 'react';
const layout = {
	labelCol: {
		span: 8
	},
	wrapperCol: {
		span: 16
	}
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
	required: '${label} is required!',
	types: {
		email: '${label} is not a valid email!',
		number: '${label} is not a valid number!'
	},
	number: {
		range: '${label} must be between ${min} and ${max}'
	}
};
/* eslint-enable no-template-curly-in-string */

const onFinish = values => {
	console.log(values);
};
const UserForm = () => {
	const { user } = UserAuth();
	const navigate = useNavigate();
	const name = useRef();
	const email = useRef();
	const age = useRef();
	const [messageApi, contextHolder] = message.useMessage();
	const info = () => {
		messageApi.error('Enter your name');
	};
	const addUser = () => {
		if (user) {
			if (name.current.input.value !== '') {
				const newUser = doc(db, 'users', user.uid);
				setDoc(newUser, {
					name: name.current.input.value,
					image: '/users-image/default.webp',
					email: email.current.input.value,
					age: age.current.value
				});
				navigate('/');
			} else {
				info();
			}
		}
	};
	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
		// eslint-disable-next-line
	}, [user]);
	useEffect(() => {
		if (user) {
			email.current.input.value = user.email;
		}
	});
	return (
		<>
			{!user ? (
				''
			) : (
				<>
					{contextHolder}
					<Form
						{...layout}
						name='nest-messages'
						onFinish={onFinish}
						style={{
							maxWidth: 600
						}}
						validateMessages={validateMessages}
					>
						<Form.Item
							name={['user', 'name']}
							label='Name'
							rules={[
								{
									required: true
								}
							]}
						>
							<Input ref={name} />
						</Form.Item>
						<Form.Item
							name={['user', 'email']}
							label='Email'
							rules={[
								{
									type: 'email'
								}
							]}
						>
							<Input ref={email} />
						</Form.Item>
						<Form.Item
							name={['user', 'age']}
							label='Age'
							rules={[
								{
									type: 'number',
									min: 0,
									max: 99
								}
							]}
						>
							<InputNumber ref={age} />
						</Form.Item>

						<Form.Item
							wrapperCol={{
								...layout.wrapperCol,
								offset: 8
							}}
						>
							<Button type='primary' htmlType='submit' onClick={addUser}>
								Submit
							</Button>
						</Form.Item>
					</Form>
				</>
			)}
		</>
	);
};

export default UserForm;
