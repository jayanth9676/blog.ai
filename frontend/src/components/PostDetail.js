import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '../config';
import './PostDetail.css'; // Import the CSS file

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                setError('Error fetching post. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.API_BASE_URL}/posts/${id}`);
            navigate('/');
        } catch (err) {
            setError('Error deleting post. Please try again later.');
        }
    };

    const handleCategoryClick = () => {
        navigate(`/?category=${encodeURIComponent(post.category)}`);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-content">
            <div className="post-detail">
                <div className="post-header">
                    <Link to="/" className="btn btn-back" aria-label="Back">
                        <i className="fas fa-arrow-left"></i>
                        <span className="btn-text">Back</span>
                    </Link>
                    <button onClick={handleCategoryClick} className="btn btn-category" aria-label={`Category: ${post.category}`}>
                        <i className="fas fa-tag"></i>
                        <span className="btn-text">{post.category}</span>
                    </button>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <div className="post-image-container">
                    {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="post-image" />
                    ) : (
                        <img src="/default-post-image.jpg" alt="Default post" className="post-image default-image" />
                    )}
                </div>
                <div className="post-actions">
                    <Link to={`/posts/${id}/edit`} className="btn btn-edit" aria-label="Edit post">
                        <i className="fas fa-edit"></i>
                        <span className="btn-text">Edit</span>
                    </Link>
                    <button onClick={handleDelete} className="btn btn-delete" aria-label="Delete post">
                        <i className="fas fa-trash-alt"></i>
                        <span className="btn-text">Delete</span>
                    </button>
                </div>
                <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className="post-meta">
                    <span className="category" onClick={handleCategoryClick}>{post.category}</span>
                    <span className="author">By {post.author ? post.author.name : 'Unknown'}</span>
                    <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="author-card">
                    <div className="author-avatar">
                        {post.author && post.author.name ? post.author.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="author-info">
                        <h3>{post.author ? post.author.name : 'Unknown'}</h3>
                        <p className="author-email">{post.author ? post.author.email : ''}</p>
                        <p className="author-bio">{post.author ? post.author.bio : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;