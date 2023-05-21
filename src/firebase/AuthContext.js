import { createContext, useContext } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	GoogleAuthProvider,
	signInWithPopup
	// signInWithRedirect
} from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import {
	collection,
	onSnapshot,
	query,
	deleteDoc,
	doc
} from 'firebase/firestore';
const UserContext = createContext();
export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState({});
	const [users, setUsers] = useState([]);
	const [current, setCurrent] = useState({});
	const [oponent, setOponent] = useState({});
	const locStore = window.localStorage;

	const googleSignIn = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider);
		// signInWithRedirect(auth, provider);
	};

	const createUser = (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const signIn = (email, password) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const deleteUser = () => {
		deleteDoc(doc(db, 'usersQuiz', user.uid));
	};
	const logout = () => {
		deleteUser();
		locStore.removeItem('user');
		return signOut(auth);
	};
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, currentUser => {
			if (currentUser) {
			} else {
			}
			setUser(currentUser);
			const str = JSON.stringify(currentUser);
			locStore.setItem('user', str);
		});
		return () => {
			unsubscribe();
		};
	}, [locStore]);
	useEffect(() => {
		const q = query(collection(db, 'users'));
		const unsubscribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			setUsers(array);
		});
		return () => {
			unsubscribe();
		};
	}, []);
	useEffect(() => {
		const q = query(collection(db, 'usersQuiz'));
		const unsubcribe = onSnapshot(q, queryCollection => {
			let array = [];
			queryCollection.forEach(doc => {
				array.push({ ...doc.data(), id: doc.id });
			});
			if (array.length > 0) {
				array.forEach(item => {
					if (user && item.id === user.uid) {
						setCurrent(item);
					} else {
						setOponent(item);
					}
				});
			} else {
				setCurrent({});
				setOponent({});
			}
		});

		return () => {
			unsubcribe();
		};
		//eslint-disable-next-line
	}, [user]);

	return (
		<UserContext.Provider
			value={{
				createUser,
				user,
				logout,
				signIn,
				googleSignIn,
				users,
				current,
				oponent
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(UserContext);
};
