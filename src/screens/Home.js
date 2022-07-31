/**
 *
 * @author Ngoc Nguyen 20176836 "Momoe app" <nguy0304@gmail.com>
 * GitHub repo: https://github.com/TheLordA/Instagram-Clone
 *
 */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { config as axiosConfig, ALL_POST_URL } from "../config/constants";
// Material-UI Components

import PostItem from "./PostItem";
import AuthenticationContext from "../contexts/auth/Auth.context";

const Home = () => {
	// 1. wanna know what the general store(useContext) have. copy this name 'AuthenticationContext'
	const { state, dispatch } = useContext(AuthenticationContext);
	// 2. print by console to view what they have
	console.log("state", AuthenticationContext);

    const token = localStorage.getItem("token");
    const config = axiosConfig(token);

	const [data, setData] = useState([]);

	useEffect(() => {
		axios.get(ALL_POST_URL, config).then((res) => {
			setData(res.data.posts);
		});
	}, []);

	return (
		<>
			<Navbar />
			{data.map( (item) => (
				<PostItem
					key={JSON.stringify(item)}
					postItem={item}
					data={data}	
					setData={setData}				
				/>
			))}
		</>
	);
};

export default Home;
