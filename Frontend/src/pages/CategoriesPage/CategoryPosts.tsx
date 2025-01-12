import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'; // Import Next.js Head component
import styles from '../../styles/CategoriesPosts.module.css';

interface Post {
    id: number;
    title: string;
    thumbnail_url: string;
    meta_desc: string;
    category: string;
    slug: string;
}

const CategoryPosts: React.FC = () => {
    const router = useRouter();
    const { category } = router.query; // Get the category from the route query
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Mapping of categories to SEO-friendly titles and descriptions
    const categoryMetadata = {
        "Design & Inspiration": {
            title: "Design & Inspiration - Tiny Home Ideas",
            description: "Explore design and inspiration ideas for creating your dream tiny home with functional and stylish layouts.",
        },
        "Building & Construction": {
            title: "Building & Construction - Tiny Home Tips",
            description: "Discover practical tips for building and constructing your own tiny home sustainably and affordably.",
        },
        "Eco-Living Tips": {
            title: "Eco-Living Tips - Sustainable Tiny Living",
            description: "Learn eco-living tips to make your tiny home sustainable with energy-efficient and eco-friendly practices.",
        },
        "Furniture & Storage": {
            title: "Furniture & Storage - Tiny Home Solutions",
            description: "Get creative furniture and storage solutions to maximize space in your tiny home.",
        },
        "Lifestyle & Wellness": {
            title: "Lifestyle & Wellness - Tiny Home Living",
            description: "Discover lifestyle and wellness tips for living comfortably and happily in a tiny home.",
        },
    } as const;

    useEffect(() => {
        if (typeof category === 'string') {
            const categoryName = category.replace(/_/g, ' ');

            const fetchPosts = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?category=${encodeURIComponent(
                            categoryName
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

    const currentCategory = typeof category === 'string' ? category.replace(/_/g, ' ') : '';
    const metadata = categoryMetadata[currentCategory as keyof typeof categoryMetadata] || {
        title: "Cozy Tiny Homes - Explore Categories",
        description: "Discover tips, ideas, and inspiration for tiny home living across various categories.",
    };

    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Head>
            <div className={styles.categoryContainer}>
                <h1 className={styles.categoryTitle}>{currentCategory}</h1>
                <div className={styles.postsGrid}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className={styles.postCard}>
                                <a href={`/post/${post.slug}`}>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${post.thumbnail_url}`}
                                        alt={post.title}
                                        className={styles.thumbnail}
                                    />
                                </a>
                                <a href={`/post/${post.slug}`} className={styles.postTitleLink}>
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
        </>
    );
};

export default CategoryPosts;