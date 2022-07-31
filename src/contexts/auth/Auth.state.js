import React, { useReducer } from "react";

import AuthContext from "./Auth.context";
import AuthReducer from "./Auth.reducer";

const AuthState = (props) => {
	let token = localStorage.getItem("token");
	let user = JSON.parse(localStorage.getItem("user"));
	let isAuthenticated =  token ? true : false;

	let initialState = {  
		isAuthenticated: isAuthenticated,
		user: user,
		token: token
	};

	const [state, dispatch] = useReducer(AuthReducer, initialState);

	return <AuthContext.Provider value={{ state, dispatch }}>{props.children}</AuthContext.Provider>;
};

export default AuthState;
