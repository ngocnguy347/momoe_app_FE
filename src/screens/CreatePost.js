
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import { config as axiosConfig, CREATE_POST_URL, TAGGING_URL } from "../config/constants";
import Navbar from "../components/Navbar";

// Material-UI deps
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import Alert from "@material-ui/lab/Alert";
// FilePond deps
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(
	FilePondPluginImagePreview,
	FilePondPluginFileEncode,
	FilePondPluginImageResize,
	FilePondPluginImageTransform,
	FilePondPluginFileValidateType
);

// General Style
const useStyles = makeStyles((theme) => ({
	root: {
		width: "70%",
		margin: "40px auto",
	},
	filesContainer: { maxWidth: "500px", margin: "auto" },
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		width: "30%",
		margin: "auto",
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: "6px 24px",
	},
	TextField: {
		margin: "10px 0px",
	},
	TextFieldTag: {
		margin: "10px 0px",
		display: "flex",
		// overflow: "scroll",
		width: "100%",
		maxWidth: "100%",
		// paddingLeft: "14px",
		border: "1px grey solid",
		borderRadius: "5px",
		color: "black"
	},
	reviewRoot: {
		maxWidth: 400,
		flexGrow: 1,
		margin: "10px auto",
	},
	reviewImg: {
		height: 255,
		display: "block",
		maxWidth: 400,
		overflow: "hidden",
		width: "100%",
	},
	reviewBottom: {
		display: "flex",
		alignItems: "center",
		height: 50,
		paddingLeft: theme.spacing(4),
		backgroundColor: theme.palette.background.default,
	},
	finishStyle: {
		width: "fit-content",
		margin: "auto",
	},
	tagContainer: {
		display: "flex",
		overflow: "auto",
		width: "100%",
		maxWidth: "100%",
		paddingLeft: "10px",
		border: "1px grey solid",
		borderRadius: "5px",
		color: "black"
	},
	tag: {
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
		padding: "6px",
		border: "none",
		backgroundColor: "unset",
		cursor: "pointer",
		color: "white",
	  }
}));

const getSteps = () => {
	return ["Select your image", "Select tags", "Submit the post"];
};

const CreatePost = () => {
	
	const classes = useStyles();
	const history = useHistory();
	const [files, setFiles] = useState([]);
	const [caption, setCaption] = useState("");
	const [hashtags, setHashtags] = useState([]);
	const [hashtagsInput, setHashtagsInput] = useState("");
	const [activeStep, setActiveStep] = useState(0);
	const [isKeyReleased, setIsKeyReleased] = useState(false);

	const steps = getSteps();

	const [query, setQuery] = useState("idle");
	const timerRef = useRef();

	const token = localStorage.getItem("token");
	const config = axiosConfig(token);

	useEffect(
		() => () => {
			clearTimeout(timerRef.current);
		},
		[]
	);


	const onKeyDown = (e) => {
		const { keyword } = e;
		const trimmedInput = hashtagsInput.trim(); //delete space in head and tail
	
		if (keyword === 'Enter' && trimmedInput.length && !hashtags.includes(trimmedInput)) {
			e.preventDefault();
			setHashtags(prevState => [...prevState, trimmedInput]);
			setHashtagsInput('');
		}
	
		if (keyword === "Backspace" && !hashtagsInput.length && hashtags.length && isKeyReleased) {
			const hashtagsCopy = [...hashtags];
			const poppedHashtag = hashtagsCopy.pop();
			e.preventDefault();
			setHashtags(hashtagsCopy);
			setHashtagsInput(poppedHashtag);
		}
	
		setIsKeyReleased(false);
	};
	
	const onKeyUp = () => {
		setIsKeyReleased(true);
	}

	const deleteTag = (index) => {
		setHashtags(prevState => prevState.filter((tag, i) => i !== index))
	}

	const handlePostData = () => {
		// the Index 0 means the first file , we will add in the future the support of multiple
		// images upload , the max will be 10 images per post
		const photoEncoded = files[0].getFileEncodeBase64String();
		const photoType = files[0].fileType;

		
		// After submit, call POST API to upload DB
		Axios.post(
			CREATE_POST_URL,
			{
				title: caption,
				body: caption,
				hashtags: hashtags,
				photoEncoded,
				photoType,
			},
			config
		).then((rep) => {
			if (rep.data) {
				setQuery("success");
				//after query success -> turn off "loading" and back HOmepage
			}
			
		}).catch((error) => {
            console.log(error);
            return error;
        });
	};

	// function extractHashtagsFromCaption() {
	// 	if (caption.length > 0) {
	// 		return caption.match(/#[a-z]+/gi).map((value) => value.slice(1, value.length));
	// 	} else {
	// 		return []
	// 	}
		
	// }

	const getStepContent = (step) => {
		switch (step) {
			// logic
			case 0:
				return (
					<div className={classes.filesContainer}>
						<FilePond
							labelIdle='Drag & Drop your picture or <span class="filepond--label-action">Select from computer</span>'
							files={files}
							allowMultiple={false}
							onupdatefiles={setFiles}
							imageResizeTargetWidth={450}
							imageResizeTargetHeight={450}
							acceptedFileTypes={["image/jpeg", "image/png", "images/gif"]}
							required={true}
						/>
						<TextField
							className={classes.TextField}
							id="outlined-search"
							label="Caption"
							type="text"
							variant="outlined"
							fullWidth="true"
							multiline="true"
							value={caption}
							onChange={
								(e) => setCaption(e.target.value)}
						/>
					</div>
				);
			// after step 1 => currentStep ->1
			case 1:
				return (
					<div className={classes.filesContainer}>
						<TextField
							className={classes.TextFieldTag}
							id="hashtags"
							label="Hashtags"
							type="text"
							variant="outlined"
							fullWidth="true"
							multiline="true"
							value={hashtagsInput}
							onChange={(e) => setHashtagsInput(e.target.value)}
							onKeyDown={onKeyDown}
							onKeyUp={onKeyUp}
						/>
						<div className={classes.tagContainer}>
							{hashtags.map((tag, index) => (
							<div className={classes.tag}>
								{tag}
								<button className={classes.buttonTag} onClick={() => deleteTag(index)}>x</button>
							</div>
							))}
						</div>
					</div>
				);
				// 
			case 2:
				return;
			default:
				return "Unknown step";
		}
	};

	const handleNext = () => {
		const photoEncoded = files[0].getFileEncodeBase64String();
		let bodyFormData = new FormData();
		bodyFormData.append('image_base64', photoEncoded);
		
		// let allHashtags = extractHashtagsFromCaption();
		let allHashtags = [];

		// predict tags
		if (activeStep === 0) {

			Axios.post(
				`https://api.imagga.com/v2/tags`,
				bodyFormData,
				{
					headers: {
						'Authorization': `Basic YWNjXzg2ZGI3MDhkNzQ3YmI3ODo2ZTAwNmNlM2Q0MzBkN2EwMmY4ZWMxN2RlYmRiMjQ0MQ==`,
					}
				}
			).then((rep) => {
				let predictedHashtags = rep.data.result.tags.map(x => x.tag.en);
				const numHashtags = 10
				if (predictedHashtags.length <= numHashtags) {
					allHashtags.push(...predictedHashtags);
				} else {
					allHashtags.push(...predictedHashtags.slice(0, numHashtags));
				}
				setHashtags(allHashtags);
			}).catch((error) => {
				console.log(error);
				return error;
			});
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		// Here, step = step + 1
	};

	const handleBack = () => {
		if (activeStep === 1) {
			setHashtags([]);
			setHashtagsInput('');
		}
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleClickQuery = () => {
		clearTimeout(timerRef.current);
		// 
		if (query !== "idle") {
			setQuery("idle");
			return;
		}
		setQuery("progress");
		timerRef.current = setTimeout(() => {
			history.push("/"); //back Homepage
			
		}, 4000);
		// create loading when load POST onto Server
	};

	const handleSubmit = () => {
		handleNext();
		handleClickQuery();
		handlePostData();
	};
	// render view of create a post//3
	return (
		<>
			<Navbar />
			<div className={classes.root}>
				<Stepper component={Paper} elevation={3} activeStep={activeStep} orientation="vertical">
					{steps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
							<StepContent>
								<Typography>{getStepContent(index)}</Typography>
								<div className={classes.actionsContainer}>
									<div>
										<Button
											disabled={activeStep === 0}
											onClick={handleBack}
											className={classes.button}
										>
											Back
										</Button>
										<Button
											// disabled={files.length === 0 || caption === ""}
											disabled={files.length === 0}
											variant="contained"
											color="primary"
											onClick={
												activeStep === steps.length - 1
													? handleSubmit
													: handleNext
											}
											className={classes.button}
										>
											{activeStep === steps.length - 1 ? "Submit" : "Next"}
										</Button>
									</div>
								</div>
							</StepContent>
						</Step>
					))}
					{activeStep === steps.length && (
						<Paper square elevation={0} className={classes.resetContainer}>
							<div className={classes.finishStyle}>
								{query === "success" ? (
									<Alert variant="outlined" severity="success">
										Your post has been successfully submitted — check it out!
									</Alert>
								) : (
									<Fade
										className={classes.finishStyle}
										in={query === "progress"}
										style={{
											transitionDelay:
												query === "progress" ? "100ms" : "0ms",
										}}
										unmountOnExit
									>
										<CircularProgress />
									</Fade>
								)}
							</div>
						</Paper>
					)}
				</Stepper>
			</div>
		</>
	);
};

export default CreatePost;