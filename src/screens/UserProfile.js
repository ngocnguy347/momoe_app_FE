/**
 *
 * @author Ngoc Nguyen 20176836 "Momoe app" <nguy0304@gmail.com>
 * GitHub repo: https://github.com/TheLordA/Instagram-Clone
 *
 */

import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { UPDATE_FOLLOW_DATA } from "../contexts/types";
import { config as axiosConfig } from "../config/constants";
import Navbar from "../components/Navbar";

// Material-UI Components
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SearchBar from "material-ui-search-bar";

// General Styles
const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 935,
		margin: "auto",
		padding: "60px 20px 0",
	},
	avatar_container: { margin: "auto" },
	avatar: { width: 152, height: 152 },
	editButton: {
		marginLeft: 20,
		backgroundColor: "paleturquoise",
	},
	posts: {
		overflow: "hidden",
		width: "100%",
	},
	posts_img: {
		width: "100%",
		height: "100%",
	},
	settings: {},
	posts_img: {
		objectFit: "contain",
		width: "100%",
	},
	imgBox: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		width: "100%",
		aspectRatio: 1 / 1,
		backgroundColor: "#F1F3F4",
		borderRadius: "8px",
		"&:hover": {
			cursor: "pointer",
			backgroundColor: "#e3e7e9",
		}
	}
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

const UserProfilePage = () => {
	const classes = useStyles();
	const [value, setValue] = useState("Posts"); // to switch between different tabs
	const { state, dispatch } = useContext(AuthenticationContext);
	const { userid } = useParams();
	const [data, setData] = useState(null);
	console.log(data);
	const [showFollow, setShowFollow] = useState(state ? !state.user.Following.includes(userid) : null);
	const [searchedPosts, setSearchedPosts] = useState([]);
	const [hashtagsInput, setHashtagsInput] = useState("");
	const token = localStorage.getItem("token");
	const config = axiosConfig(token);
	useEffect(() => {
		axios.get(`http://localhost:5000/user/${userid}`, config).then((res) => {
			setData(res.data);
		});
	}, []);

	const followUser = () => {
		axios.put(`http://localhost:5000/follow`, { followId: userid }, config).then((result) => {
			dispatch({
				type: UPDATE_FOLLOW_DATA,
				payload: { Followers: result.data.Followers, Following: result.data.Following },
			});
			localStorage.setItem("user", JSON.stringify(result.data));
			setData((prevState) => {
				return {
					...prevState,
					user: {
						...prevState.user,
						Followers: [...prevState.user.Followers, result.data._id],
					},
				};
			});
			setShowFollow(false);
		});
	};

	const unfollowUser = () => {
		axios.put(`http://localhost:5000/unfollow`, { unfollowId: userid }, config).then((result) => {
			dispatch({
				type: UPDATE_FOLLOW_DATA,
				payload: { Followers: result.data.Followers, Following: result.data.Following },
			});
			localStorage.setItem("user", JSON.stringify(result.data));
			setData((prevState) => {
				const newFollower = prevState.user.Followers.filter((item) => item !== result.data._id);
				return {
					...prevState,
					user: {
						...prevState.user,
						Followers: newFollower,
					},
				};
			});
			setShowFollow(true);
		});
	};

	function extractHashtagsFromCaption(caption) {
		let extractedHashtags;
		console.log("caption: ", caption);
		if (caption === null) {
			return []
		} else {
			extractedHashtags = caption.match(/#[a-z]+/gi);
			if (extractedHashtags === null) {
				return []
			} else {
				return extractedHashtags.map((value) => value.slice(1, value.length));
			}
		}

	}

	const handleSearch = (value) => {
		let maxNumHashtags = 0;
		let maxNumHashtagsPosts = [];
		let numSameEl;
		let allHashtags = [];
		value = value.split(","); // convert a comma splitted string into an arr
		console.log("data: ", data);
		for (var i = 0; i < data.posts.length; i++) {
			// loop over all hashtags
			allHashtags = extractHashtagsFromCaption(data.posts[i].Title);  // extract from caption
			console.log("all hashtags: ", allHashtags);
			allHashtags.push(...data.posts[i].Hashtags)

			numSameEl = value.filter(v => allHashtags.includes(v)).length
			if (numSameEl > maxNumHashtags) {
				maxNumHashtags = numSameEl;
				maxNumHashtagsPosts = [data.posts[i]];
			} else if (numSameEl === maxNumHashtags && numSameEl > 0) {
				maxNumHashtagsPosts.push(data.posts[i]);
			}
		}

		if (maxNumHashtags > 0) {
			console.log("maxNumHashtagsPosts: ", maxNumHashtagsPosts);
			setSearchedPosts(maxNumHashtagsPosts);
		}
	}

	return (
		<React.Fragment>
			<Navbar />
			<CssBaseline />
			{data ? (
				<Box component="main" className={classes.root}>
					<Box mb="44px">
						<Grid container>
							<Grid item xs={4} className={classes.avatar_container}>
								<Avatar
									className={classes.avatar}
									style={{ margin: "auto" }}
									src={data?.user?.Avatar} // TODO HERE
								/>
							</Grid>
							<Grid item xs={8}>
								<Box clone mb="20px">
									<Grid container alignItems="center">
										<Typography variant="h5">
											{data.user ? data.user.Name : "Loading ..."}
										</Typography>
										{showFollow ? (
											<Button
												className={classes.editButton}
												variant="outlined"
												onClick={() => followUser()}
											>
												Follow
											</Button>
										) : (
											<Button
												className={classes.editButton}
												variant="outlined"
												onClick={() => unfollowUser()}
											>
												UnFollow
											</Button>
										)}

										<div className={classes.settings}>
											<IconButton component={Link} to="#">
												<Icon>settings</Icon>
											</IconButton>
										</div>
									</Grid>
								</Box>
								<Box mb="20px">
									<Grid container spacing={4}>
										<Grid item>
											<Typography variant="subtitle1">
												<b>
													{data.posts
														? data.posts.length
														: "IsLoading..."}
												</b>{" "}
												posts
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1">
												<b>
													{data.user
														? data.user.Followers.length
														: "IsLoading..."}
												</b>{" "}
												followers
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1">
												<b>
													{data.user
														? data.user.Following.length
														: "IsLoading..."}
												</b>{" "}
												following
											</Typography>
										</Grid>
									</Grid>
								</Box>
								{/* <Typography variant="subtitle1">Fullname of User (ngoc nguyen)</Typography>
								<Typography variant="subtitle1">Address...sth</Typography>
								<Typography variant="subtitle1">more infor...</Typography> */}
							</Grid>
						</Grid>
					</Box>
					<Tabs
						value={value}
						centered
						onChange={(event, value) => {
							setValue(value);
						}}
						TabIndicatorProps={{
							style: { transform: "translateY(-70px)", backgroundColor: "#262626" },
						}}
					>
						<Tab label="Posts" value="Posts" icon={<Icon>grid_on_outlined</Icon>} />
						<Tab label="Search" value="Search" icon={<Icon>image_search</Icon>} />
					</Tabs>
					<TabPanel value={value} index="Posts">
						<div style={{
							marginBottom: "10px",
						}}>
							<Grid container spacing={2}>
								{data.posts
									? data.posts.map((item) => (
										<Grid item xs={4} key={item.id}>
											<div className={classes.imgBox}>
												<img
													className={classes.posts_img}
													src={`data:${item.PhotoType};base64,${item.Photo}`}
												/>
											</div>

										</Grid>
									))
									: "Loading ..."}

								{/* <Grid item xs={4} className={classes.post_box}>
								<img
									alt="post"
									style={{ width: "100%" }}
									src="https://via.placeholder.com/500/f5f5f5"
								/>
							</Grid>
							<Grid item xs={4} className={classes.post_box}>
								<img
									alt="post"
									style={{ width: "100%" }}
									src="https://via.placeholder.com/500/f5f5f5"
								/>
							</Grid> */}
							</Grid>
						</div>

					</TabPanel>
					<TabPanel value={value} index="Search">
						<SearchBar
							style={{
								margin: '0 auto',
								maxWidth: 400,
								marginBottom: 50
							}}
							value={hashtagsInput}
							onChange={(newValue) => setHashtagsInput(newValue)}
							onRequestSearch={() => handleSearch(hashtagsInput)}
						/>

						<Grid container spacing={2} >
							{searchedPosts.map((item) => (
								<Grid item xs={4} key={item.id} className={classes.posts}>
									<div className={classes.imgBox}>
										<img
											className={classes.posts_img}
											alt="post"
											src={`data:${item.PhotoType};base64,${item.Photo}`}
										/>
									</div>

								</Grid>
							))}
						</Grid>
					</TabPanel>
				</Box>
			) : (
				"Is Loading ..."
			)}
			<div style={{
				marginBottom: "15px",
			}}></div>
		</React.Fragment>
	);
};

export default UserProfilePage;
