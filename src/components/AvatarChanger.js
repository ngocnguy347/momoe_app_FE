import Button from "@material-ui/core/Button";
import { makeStyles, withStyles } from "@material-ui/styles";
import React, { useEffect, useState, useContext } from "react";


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
	editButton: {
		margin: "auto",
        marginTop: "15px"
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
}));

const AvatarChanger = (props) => {
    const classes = useStyles();

    const handleFileUpload = (event) => {
        console.log(event.target.files[0].name);
    };

    const hiddenFileInput = React.useRef(null);

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
      }

    const handleChange = async (event) => {
        const fileUploaded = event.target.files[0];
        const base64 = await convertBase64(fileUploaded)
        props.handleUpdateAvatar(base64);
    };

    return (
        <>
        <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{display:'none'}} />     
        <Button
            className={classes.editButton}
            variant="outlined"
            onClick={handleClick}
        >
            Update avatar
        </Button>
        </>
    );
}

export default AvatarChanger;