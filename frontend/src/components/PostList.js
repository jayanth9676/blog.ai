import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All articles');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        if (!hasMore) return;
        setLoading(true);
        try {
            const response = await axios.get(`https://blog-ai-assh.onrender.com/api/posts?page=${page}&limit=10${selectedCategory !== 'All articles' ? `&category=${selectedCategory}` : ''}`);
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
                const response = await axios.get('https://blog-ai-assh.onrender.com/api/posts/categories');
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
        <div className="post-list-container">
            <h2>Most recent</h2>
            <div className="categories-container">
                <h3>Categories</h3>
                {categoriesLoading ? (
                    <p>Loading categories...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="categories">
                        {categories.map(category => (
                            <button 
                                key={category} 
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="post-list">
                {posts.map(post => (
                    <div key={post._id} className="post-card">
                        <img 
                            src={'/logo512.png'} 
                            // src={post.imageUrl || '/logo512.png'} 
                            alt={post.title} 
                            className="post-card-image" 
                        />
                        <div className="post-card-content">
                            <h3 className={`color-${(post._id.charCodeAt(0) % 5) + 1}`}>
                                <Link to={`/posts/${post._id}`}>{post.title}</Link>
                            </h3>
                            <p>{createSummary(post.content)}</p>
                            <div className="post-meta">
                                <span className="category">{post.category}</span>
                                <span className="author">By {post.author ? post.author.name : 'Unknown'}</span>
                            </div>
                            <Link to={`/posts/${post._id}`} className="read-more">Read More</Link>
                        </div>
                    </div>
                ))}
            </div>
            {hasMore && !loading && (
                <button onClick={loadMore} className="load-more">Load More</button>
            )}
            {loading && <div className="loading">Loading...</div>}
        </div>
    );
};

export default PostList;