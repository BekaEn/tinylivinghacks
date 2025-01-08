import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import Next.js router
import styles from '../../styles/CategoriesPosts.module.css';

interface Post {
    id: number;
    title: string;
    thumbnail_url: string;
    meta_desc: string;
    category: string;
}

const CategoryPosts: React.FC = () => {
    const router = useRouter();
    const { category } = router.query; // Get the category from the route query
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (category) {
            const fetchPosts = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?category=${encodeURIComponent(
                            category as string
                        )}`
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts.');
                    }
                    const data = await response.json();
                    setPosts(data);
                } catch (err) {
                    console.error('Error fetching posts:', err);
                    setError('Failed to load posts for this category.');
                }
            };

            fetchPosts();
        }
    }, [category]);

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.categoryContainer}>
            <h1 className={styles.categoryTitle}>{(category as string)?.replace(/_/g, ' ')}</h1>
            <div className={styles.postsGrid}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className={styles.postCard}>
                            <a href={`/post/${post.id}`}>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${post.thumbnail_url}`}
                                    alt={post.title}
                                    className={styles.thumbnail}
                                />
                            </a>
                            <a href={`/post/${post.id}`} className={styles.postTitleLink}>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                            </a>
                            <p className={styles.metaDesc}>{post.meta_desc}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noPosts}>No posts available for this category.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPosts;