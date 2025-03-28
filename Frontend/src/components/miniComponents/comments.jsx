import { useState, useContext, useEffect } from "react";
import { Context } from "../../AppWrapper";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiMenu, FiX, FiMessageSquare } from "react-icons/fi";
import ErrorComp from "../../utility/ErrorPage";

const Comments = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditCommentBoxVisible, setIsEditCommentBoxVisible] = useState(false);
    const [editCommentText, setEditCommentText] = useState("");
    const [editCommentId, setEditCommentId] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    if (!user) {
        navigate('/login')
    } else {
        console.log("user: ", user)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`/api/v1/comment/getComment/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                setComments(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const submitComment = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/comment/newComment/${id}`, {
                comment: newComment
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });

            setComments(response.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const editComment = async (commentId) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/comment/editComment/${commentId}/${id}`, {
                newComment: editCommentText
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
            setComments(response.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (commentId) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/comment/deleteComment/${commentId}/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
            setComments(response.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        setIsButtonVisible(!isButtonVisible);
    };

    if (error) {
        return <ErrorComp />
    }

    return (
        <>
            {isCollapsed && (
                <div className="fixed top-16 right-2 inline p-2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-300">
                    <button onClick={toggleSidebar} className="relative flex items-center">
                        <FiMessageSquare className="w-6 h-6 text-gray-600" />
                        {comments.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                                {comments.length}
                            </span>
                        )}
                    </button>
                </div>
            )}

            <div>
                {/* Sidebar */}
                {!isCollapsed && (
                    <div className="fixed top-16 right-0 w-64 h-[80vh] bg-white shadow-lg transition-all duration-300 ease-in-out overflow-y-auto p-4 border-l border-gray-200 flex flex-col">
                        {/* Close Button */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Comments</h2>
                            <button onClick={toggleSidebar}>
                                <FiX className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Comments List */}
                        {!loading ? (
                            <div className="flex-1 overflow-y-auto space-y-4">
                                {comments && comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="flex items-start space-x-3 border-b pb-3">
                                            <img src={comment.authorInfo.avatar.url} alt={comment.authorInfo.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-800">{comment.authorInfo.name}</h3>
                                                <p className="text-sm text-gray-600">{comment.comment}</p>

                                                {/* Move the condition inside the wrapping div */}
                                                {comment.authorInfo.name === user.name && (
                                                    <div className="mt-2 flex space-x-2">
                                                        {(isEditCommentBoxVisible && comment._id === editCommentId) ? (
                                                            <div className="mt-2 space-y-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Edit your comment..."
                                                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                    value={editCommentText}
                                                                    onChange={(e) => setEditCommentText(e.target.value)}
                                                                />
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            editComment(comment._id);
                                                                            setIsEditCommentBoxVisible(false);
                                                                            setEditCommentText("")
                                                                            setEditCommentId("")
                                                                        }}
                                                                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setIsEditCommentBoxVisible(false)
                                                                            setEditCommentText("")
                                                                            setEditCommentId("")
                                                                        }}
                                                                        className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition-all"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setIsEditCommentBoxVisible(true);
                                                                    setEditCommentText(comment.comment); // Prefill input with existing comment
                                                                    setEditCommentId(comment._id);
                                                                }}
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                deleteComment(comment._id)
                                                            }}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No comments found</div>
                                )}
                            </div>

                        ) : (<div className="flex-1 overflow-y-auto space-y-4">Loading...</div>)}
                        {/* Comment Input */}
                        <div className="border-t pt-3 mt-3">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    submitComment();
                                    setNewComment("");
                                }}
                                className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Comments;


