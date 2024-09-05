import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import config from '../config';
import './PostForm.css';

const PostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState({ name: '', email: '', bio: '' });
    const [subTopics, setSubTopics] = useState(['']);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/posts/categories`);
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to fetch categories. Please try again.');
            }
        };

        fetchCategories();

        if (id) {
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`${config.API_BASE_URL}/posts/${id}`);
                    const post = response.data;
                    setTitle(post.title);
                    setContent(post.content);
                    setCategory(post.category);
                    setImageUrl(post.imageUrl);
                    setAuthor(post.author || { name: '', email: '', bio: '' });
                    setSubTopics(post.subTopics || ['']);
                } catch (err) {
                    console.error('Error fetching post:', err);
                    setError('Failed to fetch post. Please try again.');
                }
            };

            fetchPost();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const postData = { 
                title, 
                content, 
                category, 
                imageUrl, 
                author: JSON.stringify(author), // Stringify the author object
                subTopics: JSON.stringify(subTopics.filter(topic => topic.trim() !== '')) // Stringify the subTopics array
            };

            let response;
            if (id) {
                response = await axios.put(`${config.API_BASE_URL}/posts/${id}`, postData);
            } else {
                response = await axios.post(`${config.API_BASE_URL}/posts`, postData);
            }

            if (response.status === 200 || response.status === 201) {
                navigate('/');
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (err) {
            console.error('Error saving post:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error: ${err.response.data.message}`);
            } else {
                setError('Failed to save post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorChange = (e) => {
        const { name, value } = e.target;
        setAuthor(prev => ({ ...prev, [name]: value }));
    };

    const handleSubTopicChange = (index, value) => {
        const newSubTopics = [...subTopics];
        newSubTopics[index] = value;
        setSubTopics(newSubTopics);
    };

    const addSubTopic = () => {
        setSubTopics([...subTopics, '']);
    };

    const removeSubTopic = (index) => {
        const newSubTopics = subTopics.filter((_, i) => i !== index);
        setSubTopics(newSubTopics);
    };

    return (
        <div className="post-form-container">
            <h1 className="form-title">{id ? 'Edit Post' : 'Create New Post'}</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input
                        type="url"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                    />
                </div>
                <div className="form-group">
                    <label>Author Information</label>
                    <input
                        type="text"
                        name="name"
                        value={author.name}
                        onChange={handleAuthorChange}
                        placeholder="Author Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={author.email}
                        onChange={handleAuthorChange}
                        placeholder="Author Email"
                        required
                    />
                    <textarea
                        name="bio"
                        value={author.bio}
                        onChange={handleAuthorChange}
                        placeholder="Author Bio"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Sub Topics</label>
                    {subTopics.map((topic, index) => (
                        <div key={index} className="sub-topic-input">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => handleSubTopicChange(index, e.target.value)}
                                placeholder={`Sub Topic ${index + 1}`}
                            />
                            {index > 0 && (
                                <button type="button" onClick={() => removeSubTopic(index)} className="remove-sub-topic">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addSubTopic} className="add-sub-topic">
                        Add Sub Topic
                    </button>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : (id ? 'Update Post' : 'Create Post')}
                </button>
            </form>
        </div>
    );
};

export default PostForm;