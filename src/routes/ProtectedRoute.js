import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthenticationContext from "../contexts/auth/Auth.context";

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
	let isAuthenticated;

	if (localStorage.getItem("token") !== null) {
		isAuthenticated =  true;
	} else {
		isAuthenticated = false;
	}

	return (
		<Route
			{...restOfProps}
			render={(props) =>
				isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
			}
		/>
	);
};

export default ProtectedRoute;
