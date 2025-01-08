import React from 'react';
import { GetServerSideProps } from 'next';
import mysql from 'mysql2/promise'; 
import { RowDataPacket } from 'mysql2';
import Head from 'next/head';
import styles from '../../styles/PostPage.module.css';

interface ContentItem {
    type: 'text' | 'image' | 'video';
    value: string;
}

interface Post {
    id: number;
    title: string;
    thumbnail_url: string;
    meta_desc: string;
    content: ContentItem[];
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
            </Head>
            <div className={styles.postContainer}>
                <header>
                    <h1>{post.title}</h1>
                    <p>{post.meta_desc}</p>
                </header>
                {post.thumbnail_url && (
                    <img
                    src={`http://cozytiny.com${post.thumbnail_url}`}
                    alt="Thumbnail"
                    className={styles.thumbnail}
                    />
                )}
                <div>
                    {post.content.map((item, index) => {
                        if (item.type === 'text') {
                            return <p key={index}>{item.value}</p>;
                        }
                        if (item.type === 'image') {
                            return <img key={index} src={item.value} alt="Content" />;
                        }
                        if (item.type === 'video') {
                            return (
                                <div
                                    key={index}
                                    dangerouslySetInnerHTML={{ __html: item.value }}
                                    className={styles.videoEmbed}
                                ></div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params || {};

    if (!id) {
        return {
            notFound: true,
        };
    }

    try {
        // Connect to MySQL database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'YourSecurePassword123!',
            database: process.env.DB_NAME || 'cms_project',
            port: Number(process.env.DB_PORT) || 3306,
        });

        // Fetch the post by ID
        const [rows] = await connection.execute<RowDataPacket[]>(
            'SELECT id, title, thumbnail_url, meta_desc, content FROM Posts WHERE id = ?',
            [id]
        );

        // Close the connection
        await connection.end();

        // If no post is found
        if (rows.length === 0) {
            return {
                notFound: true,
            };
        }

        const post = rows[0] as {
            id: number;
            title: string;
            thumbnail_url: string;
            meta_desc: string;
            content: string;
        };

        // Parse the content JSON into an array
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