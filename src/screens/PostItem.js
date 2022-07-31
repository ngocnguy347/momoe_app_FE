import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// Material-UI Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import SendIcon from "@material-ui/icons/Send";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { Link } from "react-router-dom";
import { config as axiosConfig, ALL_POST_URL } from "../config/constants";

// General style
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 500,
        margin: "20px auto",
        "& .MuiTextField-root": {
            width: "100%",
        },
        "& .MuiOutlinedInput-multiline": {
            paddingTop: "8px",
            paddingBottom: "8px",
            marginTop: "5px",
            marginLeft: "5px",
            marginRight: "5px",
        },
        "& .MuiCardContent-root:last-child": {
            paddingBottom: "10px",
        },
        "& .MuiDivider-middle": {
            marginBottom: "4px",
        },
        "& .MuiListItem-root": {
            padding: "0px 16px",
        },
        "& .MuiCardContent-root": {
            paddingTop: "0px",
            paddingBottom: "5px",
        },
        "& .MuiIconButton-root:focus": {
            backgroundColor: "rgba(0, 0, 0, 0)",
        },
    },
    header: {
        padding: "10px",
    },
    media: {
        //height: 0,
        paddingTop: "56.25%", // 16:9
        height: "max-content",
    },
    likeBar: {
        height: "25px",
        paddingTop: "0px",
        marginTop: "8px",
        marginLeft: "2px",
        paddingLeft: "0px",
        paddingBottom: "4px",
    },
    comments: {
        display: "flex",
        paddingTop: "0px",
        paddingLeft: "12px",
        paddingRight: "0px",
    },
    comment_item_see_more: {
        width: "35%",
        cursor: "pointer",
    },
    comments_icon_see_more: {
        height: "17px",
        width: "17px",
        paddingTop: "4px",
        paddingBottom: "3px",
    },
    comments_icon: {
        height: "30px",
        paddingLeft: "0px",
        paddingTop: "13px",
        paddingRight: "8px",
        paddingBottom: "0px",
    },
    inline: {
        display: "inline",
        fontWeight: "600",
    },
    avatar: {
        height: "40px",
    },
    links: {
        textDecoration: "none",
    },
}));

function PostItem({ postItem, data, setData }) {
    console.log(postItem);
    const classes = useStyles();
    const { state, dispatch } = useContext(AuthenticationContext);
    const [showSend, setShowSend] = useState(false);
    const [comment, setComment] = useState("");

    const token = localStorage.getItem("token");
    const config = axiosConfig(token);

    const likePost = (id) => {
        axios.put(`http://localhost:5000/like`, { postId: id }, config)
            .then((result) => {
                const newData = data.map((item) => {
                    if (result.data._id === item._id) return result.data;
                    else return item;
                });
                setData(newData);
            })
            .catch((err) => console.log(err));
    };

    const unlikePost = (id) => {
        axios.put(`http://localhost:5000/Unlike`, { postId: id }, config)
            .then((res) => {
                const newData = data.map((item) => {
                    if (res.data._id === item._id) return res.data;
                    else return item;
                });
                setData(newData);
            })
            .catch((err) => console.log(err));
    };

    const makeComment = (text, postId) => {
        setComment("");
        axios.put(`http://localhost:5000/comment`, { text, postId }, config)
            .then((result) => {
                const newData = data.map((item) => {
                    if (result.data._id === item._id) return result.data;
                    else return item;
                });
                setData(newData);
            })
            .catch((err) => console.log(err));
        setComment("");
    };

    const deletePost = (postId) => {
        axios.delete(`http://localhost:5000/deletepost/${postId}`, config).then((res) => {
            const newData = data.filter((item) => {
                return item._id !== res.data;
            });
            setData(newData);
        });
    };

    return (
        <div className="home" key={postItem._id}>
            <Card className={classes.root}>
                <CardHeader
                    className={classes.header}
                    avatar={
                        <Avatar>
                            <img
                                className={classes.avatar}
                                alt=""
                                src={postItem?.PostedBy?.Avatar} 
                            />
                        </Avatar>
                    }

                    title={
                        <Link
                            className={classes.links}
                            to={
                                postItem.PostedBy._id !== state.user._id
                                    ? `/profile/${postItem.PostedBy._id}`
                                    : "/profile"
                            }
                        >
                            {postItem.PostedBy.Name}
                        </Link>
                    }
                    subheader={postItem.PostedAt}
                />

                <CardMedia
                    className={classes.media}
                    image={`data:${postItem.PhotoType};base64,${postItem.Photo}`}
                    // title="Paella dish"
                />

                <CardActions className={classes.likeBar} disableSpacing>
                    {postItem.Likes.includes(state.user._id) ? (
                        <IconButton
                            aria-label="Like"
                            color="secondary"
                            onClick={() => {
                                unlikePost(postItem._id);
                            }}
                        >
                            <FavoriteIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            aria-label="Like"
                            backgroundColor="red"
                            onClick={() => {
                                likePost(postItem._id);
                            }}
                        >
                            <FavoriteBorderIcon />
                        </IconButton>
                    )}
                    <IconButton aria-label="comments">
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                </CardActions>

                <CardContent>
                    <Typography variant="subtitle2" display="block" gutterBottom>
                        {postItem.Likes.length} Likes
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {postItem.Body}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {postItem.Hashtags.join(', ').replace(/^|,\s*/g, "$&\#")}
                    </Typography>
                </CardContent>

                <Divider variant="middle" />

                <List>
                    {postItem.Comments.map((cmt) => {
                        return (
                            <ListItem
                                className={classes.comment_item}
                                alignItems="flex-start"
                                key={cmt._id}
                            >
                                <ListItemText
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                <Link
                                                    className={classes.links}
                                                    to={
                                                        cmt.PostedBy._id !== state.user._id
                                                            ? `/profile/${cmt.PostedBy._id}`
                                                            : "/profile"
                                                    }
                                                >
                                                    {cmt.PostedBy.Name}
                                                </Link>
                                            </Typography>
                                            {" — "}
                                            {cmt.Text}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                    {postItem.Comments.length === 0 ? (
                        <ListItem alignItems="flex-start" style={{ left: "38%" }}>
                            <Typography variant="caption" display="block" gutterBottom>
                                No Comments yet
                            </Typography>
                        </ListItem>
                    ) : null}
                    {postItem.Comments.length > 3 && postItem.Comments.length !== 0 ? (
                        <ListItem
                            alignItems="flex-start"
                            className={classes.comment_item_see_more}
                        >
                            <Typography variant="caption" display="block" gutterBottom>
                                See all {postItem.Comments.length} comments
                            </Typography>
                            <DoubleArrowIcon className={classes.comments_icon_see_more} />
                        </ListItem>
                    ) : null}
                </List>

                <Divider variant="middle" />

                <CardContent className={classes.comments}>
                    <Avatar>
                        <img
                            className={classes.avatar}
                            alt=""

                            src={state.user.Avatar}
                        />
                    </Avatar>

                    <TextField
                        multiline
                        rows={1}
                        placeholder="Add your comment..."
                        variant="outlined"
                        value={comment}
                        onChange={(event) => {
                            event.preventDefault();
                            setComment(event.target.value);
                            setShowSend(true);
                            if (event.target.value === "") setShowSend(false);
                        }}
                    />

                    <IconButton
                        aria-label="add to favorites"
                        className={classes.comments_icon}
                        disabled={!showSend}
                        onClick={() => makeComment(comment, postItem._id)}
                    >
                        <SendIcon />
                    </IconButton>
                </CardContent>
            </Card>
        </div>
    );
}

export default PostItem;