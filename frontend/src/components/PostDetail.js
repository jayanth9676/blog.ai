import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
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
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
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
        <div className="post-detail">
            <div className="post-header">
                <Link to="/" className="btn btn-back">
                    <i className="fas fa-arrow-left"></i> Back
                </Link>
                <button onClick={handleCategoryClick} className="post-category">
                    {post.category}
                </button>
            </div>
            <h2>{post.title}</h2>
            {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="post-image" />
            ) : (
                <img src="/logo512.png" alt="Default post" className="post-image default-image" />
            )}
            <div className="post-actions">
                <Link to={`/posts/${id}/edit`} className="btn btn-edit">
                    <i className="fas fa-edit"></i> Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-delete">
                    <i className="fas fa-trash-alt"></i> Delete
                </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="post-meta">
                <span className="category" onClick={handleCategoryClick}>{post.category}</span>
                <span className="author">By {post.author ? post.author.name : 'Unknown'}</span>
            </div>
            <div className="author-card">
                <div className="author-avatar">
                    {post.author && post.author.name ? post.author.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="author-info">
                    <h3>{post.author ? post.author.name : 'Unknown'}</h3>
                    <p>{post.author ? post.author.bio : ''}</p>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;