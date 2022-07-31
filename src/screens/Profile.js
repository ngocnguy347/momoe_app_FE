
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { UPDATE_BIO, UPDATE_AVATAR } from "../contexts/types";
import VerticalTabs from "../components/VerticalTabs.js";
import Navbar from "../components/Navbar";
import AvatarChanger from "../components/AvatarChanger";
import { config as axiosConfig, MY_POST_URL } from "../config/constants";

// Material-UI Components
import { makeStyles, withStyles } from "@material-ui/styles";
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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";

import SearchBar from "material-ui-search-bar";

// Material-UI Icons
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";

// General styles
const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 935,
		margin: "auto",
		padding: "60px 20px 0",
	},
	dialogContainer: {
		"& .MuiDialog-paperWidthSm": {
			width: "80%",
			maxWidth: "900px",
		},
	},
	dialogTitle: {
		margin: "0px",
		padding: "16px",
	},
	avatar_container: { display: 'flex', flexDirection: 'column', margin: "auto" },
	avatar: { width: 152, height: 152 },
	editButton: {
		marginLeft: 20,
	},
	settings: {},
	posts: {
		// width: "270px",
		// height: "230px",
		overflow: "hidden",
	},
	posts_img: {
		objectFit: "contain",
		width: "100%",
	},
	icon: {
		color: "rgba(255, 255, 255, 0.54)",
	},
	closeButton: {
		position: "absolute",
		right: "8px",
		top: "8px",
		color: "#9e9e9e",
	},
	tag: {
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		margin: "7px 0",
		marginRight: "10px",
		padding: "0 10px",
		paddingRight: "5px",
		border: "1px solid orange",
		borderRadius: "5px",
		backgroundColor: "orange",
		whiteSpace: "nowrap",
		color: "white",
	},
	buttonTag: {
		display: "flex",
		padding: "6px",
		border: "none",
		backgroundColor: "unset",
		cursor: "pointer",
		color: "white",
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

// EditProfile dialog content style
const DialogContent = withStyles((theme) => ({
	root: {
		padding: "16px",
	},
}))(MuiDialogContent);

// EditProfile dialog actions style
const DialogActions = withStyles((theme) => ({
	root: {
		margin: "0px",
		padding: "2px",
	},
}))(MuiDialogActions);

// Tabs data container
const TabPanel = (props) => {
	const { children, value, index, ...other } = props;
	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
};

const ProfilePage = () => {
	const classes = useStyles();
	const { state, dispatch } = useContext(AuthenticationContext);
	const [data, setData] = useState([]);
	const [fullname, setFullname] = useState(state ? state.user.Fullname : null);
	const [address, setAddress] = useState(state ? state.user.Address : null);
	const [value, setValue] = useState("Posts");

	const [pickedImg, setPickedImg] = useState(null)
	const [openImg, setOpenImg] = useState(false)

	const [hashtags, setHashtags] = useState([]);
	const [hashtagsInput, setHashtagsInput] = useState("");
	const [isKeyReleased, setIsKeyReleased] = useState(false);
	const [searchedPosts, setSearchedPosts] = useState([]);
	const [avatar, setAvatar] = useState(state ? state.user.Avatar : 'https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg');

	const token = localStorage.getItem("token");
	const config = axiosConfig(token);

	useEffect(() => {
		axios.get(MY_POST_URL, config).then((res) => {
			setData(res.data.posts);
		});
	}, []);

	//Toggle the EditProfile Button to show the Dialog
	const [openEdit, setOpenEdit] = useState(false);

	const handleEditClickOpen = () => {
		setOpenEdit(true);
	};
	const handleEditClose = () => {
		setOpenEdit(false);
	};

	const updateBio = () => {
		axios.put(`http://localhost:5000/update-bio`, { address: address, fullname: fullname }, config)
		// 1. call api to input address and fullname
		.then((result) => {
			// 2. .then: save onto result var
			console.log("config: ", config)
			dispatch({
				type: UPDATE_BIO,
				payload: { Address: result.data.Address, Fullname: result.data.Fullname },
			});
			// 3. update bio on global state
			console.log('localStorage.getItem("user") before: ', localStorage.getItem("user"))
			localStorage.setItem("user", JSON.stringify(result.data));
			// 4. Save infor new user into storage of local 
			console.log('localStorage.getItem("user") after: ', localStorage.getItem("user"))
			
			setAddress(result.data.Address);
			setFullname(result.data.Fullname);
			// 5. update bio into new version
		});
	}

	const handleUpdateAvatar = (base64) => {
		axios.put(`http://localhost:5000/update-avatar`, { avatar: base64 }, config).then((result) => {
			console.log("result: ", result);
			dispatch({
				type: UPDATE_AVATAR,
				payload: { Avatar: result.data.Avatar },
			});
			localStorage.setItem("user", JSON.stringify(result.data));
			setAvatar(result.data.Avatar);
		});
	}

	const handleSaveChangeBio = () => {
		updateBio()
		setOpenEdit(false);
	}

	const onKeyDown = (e) => {
		const { key } = e;
		const trimmedInput = hashtagsInput.trim();

		if (key === ',' && trimmedInput.length && !hashtags.includes(trimmedInput)) {
			e.preventDefault();
			setHashtags(prevState => [...prevState, trimmedInput]);
			setHashtagsInput('');
		}

		if (key === "Backspace" && !hashtagsInput.length && hashtags.length && isKeyReleased) {
			const hashtagsCopy = [...hashtags];
			const poppedHashtag = hashtagsCopy.pop();
			e.preventDefault();
			setHashtags(hashtagsCopy);
			setHashtagsInput(poppedHashtag);
		}

		setIsKeyReleased(false);
	};

	// const onKeyUp = () => {
	// 	setIsKeyReleased(true);
	// }

	// const deleteTag = (index) => {
	// 	setHashtags(prevState => prevState.filter((tag, i) => i !== index))
	// }

	function extractHashtagsFromCaption(caption) {
		let extractedHashtags;
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
		//abc
		let maxNumHashtags = 0;
		let maxNumHashtagsPosts = [];
		let numSameEl;
		let allHashtags = [];
		value = value.split(","); // convert a comma splitted string into an arr

		for (var i = 0; i < data.length; i++) {
			// lặp các bài post. data là list các bài post

			// loop over all hashtags
			allHashtags = extractHashtagsFromCaption(data[i].title);  // extract from caption
			allHashtags.push(...data[i].hashtags)

			numSameEl = value.filter((v) => allHashtags.includes(v)).length

			if (numSameEl > maxNumHashtags) {
				maxNumHashtags = numSameEl;
				maxNumHashtagsPosts = [data[i]];
			} else if (numSameEl === maxNumHashtags && numSameEl > 0) {
				maxNumHashtagsPosts.push(data[i]);
			}
		}

		if (maxNumHashtags > 0) {
			console.log("maxNumHashtagsPosts: ", maxNumHashtagsPosts);
			setSearchedPosts(maxNumHashtagsPosts);
		}
	}

	const handleImageClick = (item) => {
		setOpenImg(true)
		setPickedImg(item)
		console.log(item)
	}

	const handleImageUnclick = (item) => {
		setOpenImg(false)
		setPickedImg(null)
		console.log(item)
	}

	console.log("pickedIm: ", pickedImg)

	return (
		<>
			<Navbar />
			<CssBaseline />
			<Box component="main" className={classes.root}>
				{/* User Profile Data Goes Here */}
				<Box mb="44px">
					<Grid container>
						<Grid item xs={4} className={classes.avatar_container}>
							<Avatar
								className={classes.avatar}
								style={{ margin: "auto" }}
								src={avatar}
							/>
							<AvatarChanger avatar={avatar} handleUpdateAvatar={handleUpdateAvatar}/>
						</Grid>

						{/* Edit profile */}
						<Grid item xs={8}>
							<Box clone mb="20px">
								<Grid container alignItems="center">
									<Typography variant="h5">
										{state ? state.user.Name : "IsLoading ..."}
									</Typography>
									<Button
										className={classes.editButton}
										variant="outlined"
										onClick={handleEditClickOpen}
									>
										Edit Profile
									</Button>
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
											<b>{data.length}</b> 
											posts
										</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle1">
											<b>
												{state
													? state.user.Followers.length
													: "IsLoading ..."}
											</b>{" "}
											followers
										</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle1">
											<b>
												{state
													? state.user.Following.length
													: "IsLoading ..."}
											</b>{" "}
											following
										</Typography>
									</Grid>
								</Grid>
							</Box>
							<Typography variant="subtitle1">{fullname}</Typography>
							<Typography variant="subtitle1">{state.user.Email}</Typography>
							<Typography variant="subtitle1">{address}</Typography>
						</Grid>
					</Grid>
				</Box>
				{/* Tabs Goes Reference Here */}
				<Tabs
					value={value}
					centered
					onChange={(event, value) => {
						setValue(value);
					}}
					TabIndicatorProps={{
						style: {
							transform: "translateY(-70px)",
							backgroundColor: "#262626",
						},
					}}
				>
					<Tab label="Posts" value="Posts" icon={<Icon>grid_on_outlined</Icon>} />
					<Tab label="Search" value="Search" icon={<Icon>image_search</Icon>} />
				</Tabs>
				{/* Tabs Data Goes Here */}
				<TabPanel value={value} index="Posts">
					<Grid container spacing={2}>
						{data.map((item) => (
							<Grid item xs={4} key={item.id} className={classes.posts} spacing={2}>
								<div className={classes.imgBox}>
									<img
										className={classes.posts_img}
										alt="post"
										src={`data:${item.photoType};base64,${item.photo}`}
										onClick={() => handleImageClick(item)}
									/>
								</div>

							</Grid>
						))}
					</Grid>
				</TabPanel>
				<TabPanel value={value} index="Search">
					<SearchBar
						style={{
							margin: '0 auto',
							maxWidth: 400,
							marginBottom: 50
						}}
						value={hashtagsInput} // hashtagsInput = "abc"
						onChange={(newValue) => setHashtagsInput(newValue)}
						onRequestSearch={() => handleSearch(hashtagsInput)}
					/>

					<Grid container spacing={2}>
						{searchedPosts.map((item) => (
							<Grid item xs={4} key={item.id} className={classes.posts}>
								<img
									className={classes.posts_img}
									alt="post"
									src={`data:${item.photoType};base64,${item.photo}`}
								/>
							</Grid>
						))}
					</Grid>
				</TabPanel>
			</Box>
			
			{/* EditProfile Dialog */}
			<Dialog onClose={handleEditClose} open={openEdit} className={classes.dialogContainer}>
				<DialogTitle disableTypography className={classes.dialogTitle}>
					<Typography variant="h6">Profile settings</Typography>
					<IconButton
						aria-label="close"
						className={classes.closeButton}
						onClick={handleEditClose}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<VerticalTabs
						fullname={fullname}
						setFullname={setFullname}
						address={address}
						setAddress={setAddress}
					/>
				</DialogContent>
				<DialogActions>
					<Button autoFocus
						onClick={handleSaveChangeBio}
						color="primary"
					>
						Save changes
					</Button>
				</DialogActions>
			</Dialog>


			{/* View Image Dialog */}
			<Dialog onClose={handleImageUnclick} open={openImg} className={classes.dialogContainer}>
				<DialogTitle disableTypography className={classes.dialogTitle}>
					<Typography variant="h6">Photo Viewer</Typography>
					<IconButton
						aria-label="close"
						className={classes.closeButton}
						onClick={handleImageUnclick}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					{openImg === true &&
						<img
							className={classes.posts_img}
							alt="post"
							src={`data:${pickedImg.photoType};base64,${pickedImg.photo}`}
						// onClick={(e) => handleImageClick(item)}
						/>}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProfilePage;
