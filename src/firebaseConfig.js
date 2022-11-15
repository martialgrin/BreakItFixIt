import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update } from "firebase/database"; // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const config = {
	apiKey: "AIzaSyAhSjoeCqJoBWrulH9XkD4iN-hmVWccxIo",
	authDomain: "breakitfixit-9f67d.firebaseapp.com",
	databaseURL:
		"https://breakitfixit-9f67d-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "breakitfixit-9f67d",
	storageBucket: "breakitfixit-9f67d.appspot.com",
	messagingSenderId: "206776885912",
	appId: "1:206776885912:web:a71fe30fd7056d9be066ed",
};

export const firebaseConfig = () => {
	const app = initializeApp(config);
	console.log(app);

	const initValues = async () => {
		const db = getDatabase(app);
		for (let i = 0; i < 16; i++) {
			set(ref(db, "poster" + i), {
				x: 0,
				y: 0,
				isPressed: false,
			});
		}
	};

	const setValues = async (val, name) => {
		const db = getDatabase(app);
		update(ref(db, name), {
			x: val.x,
			y: val.y,
			isPressed: val.state,
		});
	};
	return { initValues, setValues };
};
