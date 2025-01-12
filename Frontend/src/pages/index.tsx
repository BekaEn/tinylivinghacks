import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Use Next.js Link for client-side navigation
import styles from '../styles/HomePage.module.css'; // Assuming you have CSS for styling

interface Post {
    id: number;
    title: string;
    thumbnail_url: string;
    meta_desc: string;
    content: string;
    slug: string;
}


const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        // Fetch posts from the backend
        const fetchPosts = async () => {
          try {
              const response = await fetch('https://cozytiny.com/api/posts');
      
              if (!response.ok) {
                  throw new Error(`Error: ${response.status} - ${response.statusText}`);
              }
      
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
            <h1>Living Tiny, Living Smart</h1>
            <p>Find guides for a more sustainable and minimalist lifestyle.</p>
            </header>
            <main className={styles.main}>
                <h2>Latest Posts</h2>
                <div className={styles.postsGrid}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.postCard}>
                            <Link href={`/post/${post.slug}`} className={styles.postLink}>
    <img
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${post.thumbnail_url}`}
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