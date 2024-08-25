import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AuthorForm from './AuthorForm';

const PostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState({ name: '', email: '', bio: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [subTopics, setSubTopics] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const addSubTopic = () => {
        setSubTopics([...subTopics, '']);
    };

    const updateSubTopic = (index, value) => {
        const updatedSubTopics = [...subTopics];
        updatedSubTopics[index] = value;
        setSubTopics(updatedSubTopics);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                setLoading(true);
                try {
                    const response = await axios.get(`https://blog-ai-assh.onrender.com/api/posts/${id}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                    setCategory(response.data.category);
                    setAuthor(response.data.author);
                    setSubTopics(response.data.subTopics || []);
                    setImagePreview(response.data.imageUrl);
                } catch (err) {
                    setError('Error fetching post. Please try again later.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('author', JSON.stringify(author));
        formData.append('subTopics', JSON.stringify(subTopics));
        if (image) {
            formData.append('image', image);
        }

        try {
            if (id) {
                await axios.put(`https://blog-ai-assh.onrender.com/api/posts/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('https://blog-ai-assh.onrender.com/api/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/');
        } catch (err) {
            setError('Error saving post. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="post-form-container">
            <h2 className="form-title">{id ? 'Edit Post' : 'Create New Post'}</h2>
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group scrollable-editor">
                    <label htmlFor="content">Content</label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                        className="form-quill"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Post Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-input"
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                    )}
                </div>
                <div className="form-group">
                    <label>Sub-topics</label>
                    {subTopics.map((topic, index) => (
                        <input
                            key={index}
                            type="text"
                            value={topic}
                            onChange={(e) => updateSubTopic(index, e.target.value)}
                            placeholder={`Sub-topic ${index + 1}`}
                            className="form-input"
                        />
                    ))}
                    <button type="button" onClick={addSubTopic} className="btn btn-secondary">
                        Add Sub-topic
                    </button>
                </div>
                <AuthorForm
                    author={author}
                    onUpdate={(updatedAuthor) => setAuthor(updatedAuthor)}
                    disabled={loading}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (id ? 'Update' : 'Create')} Post
                </button>
            </form>
            <div className="author-preview">
                <h3>Author Preview</h3>
                <div className="author-details">
                    <img src="/path/to/logo.png" alt="Author Logo" className="author-logo" />
                    <div>
                        <h4>{author.name}</h4>
                        <p className="author-email">{author.email}</p>
                        <p className="author-bio">{author.bio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostForm;