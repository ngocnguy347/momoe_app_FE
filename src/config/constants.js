/**
 *
 * @author Anass Ferrak aka " TheLordA " <an.ferrak@gmail.com>
 * GitHub repo: https://github.com/TheLordA/Instagram-Web-App-MERN-Stack-Clone
 *
 */

/**
 *  This File will Contains all Constants Used in the whole
 *  Client Code In order to make it more Cleaner
 */

// This is the config used in order to send
// our token with Axios requests
export const config = (token) => {
	return {
		headers: {
			Authorization: "Bearer " + token,
		},
	};
};

/**
 * EndPoints of the API used in the code
 */
//  http://localhost:5000

// CreatePost Screen
export const CREATE_POST_URL = `http://localhost:5000/createpost`;

// Home Screen
export const ALL_POST_URL = `http://localhost:5000/allpost`;

// Login Screen
export const LOGIN_URL = `http://localhost:5000/signin`;

// NewPassword Screen
export const NEW_PWD_URL = `http://localhost:5000/new-pwd`;

// Profile Screen
export const MY_POST_URL = `http://localhost:5000/mypost`;

// ResetPassword Screen
export const RESET_PWD_URL = `http://localhost:5000/reset-pwd`;

// SignUp Screen
export const SIGNUP_URL = `http://localhost:5000/signup`;

// SubscribePosts Screen
export const SUB_POST_URL = `http://localhost:5000/subspost`;

// Tagging model
// export const TAGGING_URL = `https://7xwwl7re0e.execute-api.us-east-1.amazonaws.com/dev/transform`
export const TAGGING_URL = `https://api.imagga.com`

export const USER_SEARCH_URL = `http://localhost:5000/users-research`