import React, { useEffect, useContext } from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

import AuthContext from "../contexts/auth/Auth.context";
import ProtectedRoute from "./ProtectedRoute";

// different routes
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import CreatePost from "../screens/CreatePost.js";
import Profile from "../screens/Profile";
import UserProfile from "../screens/UserProfile";
import SubscribePost from "../screens/SubscribePosts";
import Reset from "../screens/ResetPassword.js";
import NewPass from "../screens/NewPassword.js";

const Routing = () => {
	let isAuthenticated = localStorage.getItem("token") !== null;

	useEffect(() => {
		isAuthenticated ? <Redirect to="/" /> : <Redirect to="/login" />;
	});

	return (
		<BrowserRouter>
			<Switch>
				{/* Public routes */}
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/reset" component={Reset} />
				<Route exact path="/reset/:token" component={NewPass} />

				{/* Separate the protected routes from public ones */}
				<ProtectedRoute exact path="/" component={Home} />
				<ProtectedRoute exact path="/explore" component={SubscribePost} />
				<ProtectedRoute exact path="/create" component={CreatePost} />
				<ProtectedRoute exact path="/profile" component={Profile} />
				<ProtectedRoute exact path="/profile/:userid" component={UserProfile} />

				{/* in case we want to handle the 404 page not found */}
				{/* <Route component={NotFound} /> */}
			</Switch>
		</BrowserRouter>
	);
};

export default Routing;
