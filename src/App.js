/**
 *
 * @author Ngoc Nguyen 20176836 "Momoe app" <nguy0304@gmail.com>
 * GitHub repo: https://github.com/
 *
 */

import React from "react";
import AuthentificationState from "./contexts/auth/Auth.state";
import Routing from "./routes/Routing";
import "./App.css";

const App = () => {
	return (
		<AuthentificationState>
			<Routing />
		</AuthentificationState>
	);
};

export default App;
