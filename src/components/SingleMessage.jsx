import { UserAuth } from '../firebase/AuthContext';
import { useEffect, useState } from 'react';
import StorageService from '../firebase/services';
import { Space, Spin } from 'antd';

const SingleMessage = ({ item }) => {
	const [url, setUrl] = useState('');
	const { user } = UserAuth();
	const fetchUrl = async () => {
		const urlData = await StorageService.getImageURL(item.image);
		return setUrl(urlData);
	};
	useEffect(() => {
		fetchUrl();
		// eslint-disable-next-line
	}, []);
	return (
		<>
			{user ? (
				<li>
					<div
						className={
							item.user === user.uid ? 'cur-user-message' : 'message-box'
						}
					>
						<div className='user-info'>
							<div className='user'>
								{url ? (
									<img src={url} alt='avatar' />
								) : (
									<Space direction='vertical' className='spiner'>
										<Spin></Spin>
									</Space>
								)}
							</div>
						</div>
						<div className='message-value'>
							<div className='user-name'>
								<p>{item.userName}</p>
							</div>
							<div className='value-box'>
								<div className='value'>
									<p>{item.value}</p>
								</div>
								<div className='date-box'>
									<span className='time'>{item.time}</span>
								</div>
							</div>
						</div>
					</div>
				</li>
			) : (
				<li>
					<div className={'message-box'}>
						<div className='user-info'>
							<div className='user'>
								<img src={url} alt='avatar' />
							</div>
						</div>
						<div className='message-value'>
							<div className='user-name'>
								<p>{item.userName}</p>
							</div>
							<div className='value-box'>
								<div className='value'>
									<p>{item.value}</p>
								</div>
								<div className='date-box'>
									<span className='time'>{item.time}</span>
								</div>
							</div>
						</div>
					</div>
				</li>
			)}
		</>
	);
};

export default SingleMessage;
