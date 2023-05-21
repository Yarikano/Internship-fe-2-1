import { NavLink } from 'react-router-dom';

const Nav = () => {
	return (
		<>
			<nav className='nav'>
				<ul className='nav-list'>
					<li>
						<NavLink to='quiz'>Quiz</NavLink>
					</li>
					<li>
						<NavLink to='chat'>Chat</NavLink>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default Nav;
