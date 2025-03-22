import { useState, useContext, useEffect } from "react";
import { Context } from "../../AppWrapper";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiMenu, FiX } from "react-icons/fi";
import Loader from "../../utility/Loader";
import ErrorComp from "../../utility/ErrorPage";

const Comments = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditCommentBoxVisible, setIsEditCommentButtonVisible] = useState(false);
    const [editCommentText, setEditCommentText] = useState("");
    if (!user) {
        navigate('/login')
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/api/v1/comment/getComment/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                setComments(response.data.comments);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const submitComment = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/comment/createComment`, {
                comment: newComment
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            setComments(response.data.comments);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const editComment = async (commentId) => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:8000/api/v1/comment/editComment/${commentId}/${id}`, {
                comment: editCommentText
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            setComments(response.data.comments);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (commentId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8000/api/v1/comment/deleteComment/${commentId}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            setComments(response.data.comments);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [comments, setComments] = useState([
        {
            "_id": "hfufbisgbgbugb",
            "comment": "Amazing blog, once in a moon.",
            "authorInfo":{
                "_id": "ieihffgds",
                "name": "Sachin",
                "avatar": {
                    "public_id": "dhbvbs",
                    "url": "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                }
            }
        },
        {
            "_id": "asdh12312asd",
            "comment": "Great insights! Loved the way you explained it.",
            "authorInfo": {
                "_id": "user12345",
                "name": "Priya Sharma",
                "avatar": {
                    "public_id": "abcxyz",
                    "url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww"
                }
            }
        },
        {
            "_id": "xyz098765",
            "comment": "This was really helpful, thank you!",
            "authorInfo": {
                "_id": "user67890",
                "name": "Rahul Verma",
                "avatar": {
                    "public_id": "defuvw",
                    "url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D"
                }
            }
        }
        
    ]);
    const [newComment, setNewComment] = useState("");

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        setIsButtonVisible(!isButtonVisible);
    };

    if(loading){
        return <Loader/>
    } 

    if(error){
        return <ErrorComp/>
    } 

    return (
        <>
            {isButtonVisible && (
                <div className="fixed top-16 right-2 inline p-2 w-10 h-10 bg-white shadow-lg rounded-full">
                    <button onClick={toggleSidebar}>
                        <FiMenu className="w-6 h-6 text-gray-600" />
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
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {comments.map((comment, index) => (
                                <div key={index} className="flex items-start space-x-3 border-b pb-3">
                                    <img src={comment.authorInfo.avatar.url} alt={comment.authorInfo.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">{comment.authorInfo.name}</h3>
                                        <p className="text-sm text-gray-600">{comment.comment}</p>

                                        {/* Move the condition inside the wrapping div */}
                                        {comment.authorInfo.name === user.name && (
                                            <div className="mt-2 flex space-x-2">
                                                <>
                                                    {isEditCommentBoxVisible && (
                                                        <>
                                                            <input
                                                                type="text"
                                                                placeholder="Write a comment..."
                                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                value={editCommentText}
                                                                onChange={(e) => setEditCommentText(e.target.value)}
                                                            />

                                                            <button
                                                                onClick={() => {
                                                                    editComment(comment._id);
                                                                    setEditCommentText("");
                                                                    setIsEditCommentButtonVisible(false);
                                                                }}
                                                                className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
                                                            >
                                                                Submit
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                                <button onClick={() => {
                                                    setEditCommentText("");
                                                    setIsEditCommentButtonVisible(true);
                                                }} className="text-blue-500 hover:underline">Edit</button>
                                                <button onClick={deleteComment(comment._id)} className="text-red-500 hover:underline">Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

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
