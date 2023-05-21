import Message from './Message';
import TextMessageArea from './TextMessageArea';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import classnames from 'classnames';

const Chat = () => {
	const [showChat, setShowChat] = useState(false);

	return (
		<>
			<div
				className={classnames({
					messages: true,
					show: showChat
				})}
			>
				{showChat ? (
					<CloseOutlined
						onClick={() => {
							setShowChat(!showChat);
						}}
					/>
				) : (
					<MessageOutlined
						onClick={() => {
							setShowChat(!showChat);
						}}
					/>
				)}

				<Message />
				<TextMessageArea />
			</div>
		</>
	);
};

export default Chat;
