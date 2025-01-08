import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/HomePage.module.css'; // Assuming you have a CSS file for styling

interface Post {
    id: number;
    title: string;
    thumbnail_url: string;
    meta_desc: string;
    content: string;
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        // Fetch posts from the backend
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://138.197.21.202:3000/api/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className={styles.homeContainer}>
            <header className={styles.header}>
                <h1>Welcome to Tiny Living Hacks</h1>
                <p>Explore the latest tips, tricks, and guides for sustainable living.</p>
            </header>
            <main className={styles.main}>
                <h2>Latest Posts</h2>
                <div className={styles.postsGrid}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.postCard}>
                            <Link to={`/post/${post.id}`} className={styles.postLink}>
                                <img
                                    src={`http://138.197.21.202:3000${post.thumbnail_url}`}
                                    alt={post.title}
                                    className={styles.thumbnail}
                                />
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <p className={styles.metaDesc}>{post.meta_desc}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;