import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import config from '../config';
import './PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All articles');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const location = useLocation();

    const fetchPosts = useCallback(async () => {
        if (!hasMore) return;
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_BASE_URL}/posts?page=${page}&limit=10${selectedCategory !== 'All articles' ? `&category=${selectedCategory}` : ''}`);
            if (page === 1) {
                setPosts(response.data.posts);
            } else {
                setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
            }
            setHasMore(response.data.hasMore);
        } catch (err) {
            console.error('Error fetching posts:', err.response ? err.response.data : err.message);
            setError('Error fetching posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, selectedCategory]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const response = await axios.get(`${config.API_BASE_URL}/posts/categories`);
                const uniqueCategories = ['All articles', ...new Set(response.data)];
                setCategories(uniqueCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Error fetching categories. Please try again later.');
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
            setPage(1);
            setHasMore(true);
        }
    }, [location]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPosts([]);
        setPage(1);
        setHasMore(true);
    };

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const createSummary = (content) => {
        const plainText = content.replace(/<[^>]+>/g, '').trim();
        const summary = plainText.split('.')[0].substring(0, 100) + '...';
        return summary;
    };

    if (loading && posts.length === 0) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-content">
            <h1 className="page-title">Explore the Future of Blogging</h1>
            <div className="post-list-container">
                <aside className="categories-sidebar">
                    <h2 className="sidebar-title">Categories</h2>
                    {categoriesLoading ? (
                        <p className="loading-text">Loading categories...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : (
                        <ul className="category-list">
                            {categories.map(category => (
                                <li key={category}>
                                    <button 
                                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
                <main className="post-grid">
                    {posts.map(post => (
                        <article key={post._id} className="post-card">
                            <div className="post-card-image-container">
                                <img 
                                    src={post.imageUrl || '/default-post-image.jpg'}
                                    alt={post.title} 
                                    className="post-card-image" 
                                />
                                <div className="post-card-category">{post.category}</div>
                            </div>
                            <div className="post-card-content">
                                <h2 className="post-title">
                                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                                </h2>
                                <p className="post-summary">{createSummary(post.content)}</p>
                                <div className="post-meta">
                                    <span className="author">By {post.author ? post.author.name : 'Unknown'}</span>
                                    <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Link to={`/posts/${post._id}`} className="read-more-btn">Read More</Link>
                            </div>
                        </article>
                    ))}
                </main>
            </div>
            {hasMore && !loading && (
                <div className="load-more-container">
                    <button onClick={loadMore} className="load-more-btn">
                        <span>Load More</span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                </div>
            )}
            {loading && <div className="loading-spinner"></div>}
        </div>
    );
};

export default PostList;