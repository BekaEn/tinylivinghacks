import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import Head from 'next/head';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP } from 'react-icons/fa';
import styles from '../../styles/PostPage.module.css';

interface ContentItem {
    type: 'text' | 'image' | 'video';
    value: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    thumbnail_url: string;
    meta_desc: string;
    content: ContentItem[];
    category: string;
}

interface PostDetailsPageProps {
    post: Post | null;
    error?: string;
}

const PostDetailsPage: React.FC<PostDetailsPageProps> = ({ post, error }) => {
    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    if (!post) {
        return <p className={styles.loading}>Loading...</p>;
    }

    return (
        <>
            <Head>
                <title>{post.title} | Tiny Living Hacks</title>
                <meta name="description" content={post.meta_desc} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.meta_desc} />
                <meta property="og:url" content={`https://cozytiny.com/post/${post.slug}`} />
                <meta property="og:image" content={`https://cozytiny.com${post.thumbnail_url}`} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.meta_desc} />
                <meta name="twitter:image" content={`https://cozytiny.com${post.thumbnail_url}`} />
                <link rel="canonical" href={`https://cozytiny.com/post/${post.slug}`} />
            </Head>
            <div className={styles.postContainer}>
            <nav className={styles.breadcrumb}>
    <Link href="/">Home</Link>
    <span className={styles.breadcrumbIcon}>›</span>
    <Link
        href={`/Category/${encodeURIComponent(post.category.replace(/\s/g, '_'))}`}
    >
        {post.category}
    </Link>
    <span className={styles.breadcrumbIcon}>›</span>
    <span>{post.title}</span>
</nav>

                <div className={styles.contentContainer}>
                    <div className={styles.postContent}>
                        <header>
                            <h1 className={styles.title}>{post.title}</h1>
                            <p className={styles.metaDesc}>{post.meta_desc}</p>
                        </header>
                        {post.thumbnail_url && (
                            <img
                                src={`https://cozytiny.com${post.thumbnail_url}`}
                                alt="Thumbnail"
                                loading="lazy"
                                className={styles.thumbnail}
                            />
                        )}
                        <div className={styles.content}>
    {post.content.map((item, index) => {
        if (item.type === 'text') {
            // Check for [VIDEO] tags and extract iframe content
            const videoMatch = item.value.match(/\[VIDEO\](.*?)\[\/?VIDEO\]/i);
            if (videoMatch) {
                const iframeContent = videoMatch[1].trim();
                const srcMatch = iframeContent.match(/src="([^"]+)"/);
                const titleMatch = iframeContent.match(/title="([^"]+)"/);

                if (srcMatch && titleMatch) {
                    const src = srcMatch[1];
                    const title = titleMatch[1];

                    return (
                        <div key={index} className={styles.videoEmbed}>
                            <iframe
                                width="560"
                                height="315"
                                src={src}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                }
            }

            // If no video, render the plain text
            return <p key={index} className={styles.text}>{item.value}</p>;
        }
        if (item.type === 'image') {
            // Render image content
            return (
                <img
                key={index}
                src={`https://cozytiny.com${item.value}`} // Ensure full URL for image
                alt={post.title} // Use post title as alt text
                className={styles.contentImage} // Add class for styling
                />
            );
        }
        return null;
    })}
</div>
                    </div>
                    <div className={styles.shareButtons}>
                        <p>Share:</p>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=https://cozytiny.com/post/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.shareIcon} ${styles.facebook}`}
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=https://cozytiny.com/post/${post.slug}&text=${post.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.shareIcon} ${styles.twitter}`}
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://cozytiny.com/post/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.shareIcon} ${styles.linkedin}`}
                        >
                            <FaLinkedinIn />
                        </a>
                        <a
                            href={`https://pinterest.com/pin/create/button/?url=https://cozytiny.com/post/${post.slug}&media=https://cozytiny.com${post.thumbnail_url}&description=${post.meta_desc}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.shareIcon} ${styles.pinterest}`}
                        >
                            <FaPinterestP />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params || {};

    if (!slug) {
        return {
            notFound: true,
        };
    }

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'YourSecurePassword123!',
            database: process.env.DB_NAME || 'cms_project',
            port: Number(process.env.DB_PORT) || 3306,
        });

        const [rows] = await connection.execute<RowDataPacket[]>(
            'SELECT id, title, slug, thumbnail_url, meta_desc, content, category FROM Posts WHERE slug = ?',
            [slug]
        );

        await connection.end();

        if (rows.length === 0) {
            return {
                notFound: true,
            };
        }

        const post = rows[0] as {
            id: number;
            title: string;
            slug: string;
            thumbnail_url: string;
            meta_desc: string;
            content: string;
            category: string;
        };

        const content = JSON.parse(post.content || '[]');

        return {
            props: {
                post: { ...post, content },
            },
        };
    } catch (error) {
        console.error('Error fetching post:', error);
        return {
            notFound: true,
        };
    }
};

export default PostDetailsPage;