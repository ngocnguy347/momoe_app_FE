/* eslint-disable import/no-anonymous-default-export */
import { FETCH_USER_DATA, UPDATE_FOLLOW_DATA, UPDATE_BIO, UPDATE_AVATAR, LOGOUT } from "../types";

export default (state, action) => {
	
	const { payload, type } = action;

	let token = localStorage.getItem("token");
	let user = JSON.parse(localStorage.getItem("user"));
	let isAuthenticated =  token ? true : false;

	switch (type) {
		case FETCH_USER_DATA:
			return {
				...state,
				isAuthenticated: isAuthenticated,
				user: user,
				token: token,
			};
		case UPDATE_FOLLOW_DATA:
			return {
				...state,
				Followers: payload.Followers,
				Following: payload.Following,
			};
		case UPDATE_BIO:
			return {
				...state,
				Fullname: payload.Fullname,
				Address: payload.Address,				
			}
		case UPDATE_AVATAR:
			return {
				...state,
				Avatar: payload.Avatar,
			}
		case LOGOUT:
			localStorage.clear();
			return {
				...state,
				isAuthenticated: isAuthenticated,
				user: null,
				token: null,
			}
		default:
			return state;
	}
};
