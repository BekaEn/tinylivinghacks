import React, { useRef } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import Head from 'next/head';
import styles from '../../styles/PostPage.module.css';

interface ContentItem {
    type: 'text' | 'image' | 'video';
    value: string;
}

interface Step {
    id: number;
    title: string;
    content: string;
    video?: string | null;
    image?: string | null;
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
    steps: Step[];
    error?: string;
}

const PostDetailsPage: React.FC<PostDetailsPageProps> = ({ post, steps, error }) => {
    const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    if (!post) {
        return <p className={styles.loading}>Loading...</p>;
    }

    const scrollToStep = (index: number) => {
        if (stepRefs.current[index]) {
            stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

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
                        href={`/Category/${encodeURIComponent(
                            post.category.replace(/\s/g, '_')
                        )}`}
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
                                alt={post.title}
                                loading="lazy"
                                className={styles.thumbnail}
                            />
                        )}

                        {/* Steps Titles Section */}
                        {steps.length > 0 && (
                            <div className={styles.stepsTitles}>
                                
                                <ul className={styles.stepsList}>
                                    {steps
                                        .filter(
                                            (step) =>
                                                step.title ||
                                                step.content ||
                                                step.video ||
                                                step.image
                                        )
                                        .map((step, index) => (
                                            <li
                                                key={index}
                                                className={styles.stepTitle}
                                                onClick={() => scrollToStep(index)}
                                            >
                                                {step.title}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}

                        {/* Main Post Content */}
                        <div className={styles.content}>
                            {post.content.map((item, index) => {
                                if (item.type === 'text') {
                                    return (
                                        <p key={index} className={styles.text}>
                                            {item.value}
                                        </p>
                                    );
                                }
                                if (item.type === 'image') {
                                    return (
                                        <img
                                            key={index}
                                            src={`https://cozytiny.com${item.value}`}
                                            alt={post.title}
                                            className={styles.contentImage}
                                        />
                                    );
                                }
                                if (item.type === 'video') {
                                    return (
                                        <iframe
                                            key={index}
                                            width="560"
                                            height="315"
                                            src={item.value}
                                            title={`Video ${index + 1}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* Steps Content */}
                        {steps.length > 0 && (
    <div className={styles.steps}>
       
        {steps.map((step, index) => (
            <div
                key={index}
                className={styles.step}
                ref={(el) => {
                    stepRefs.current[index] = el;
                }}
            >
                {/* Render Title */}
                {step.title && (
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                )}

                {/* Render Content */}
                {step.content && (
                    <div className={styles.stepContent}>
                        {step.content.split('\n').map((line, idx) => {
                            // Handle bullet points
                            if (line.trim().startsWith('•')) {
                                return (
                                    <li key={idx} className={styles.bulletPoint}>
                                        {line.trim().slice(1).trim()}
                                    </li>
                                );
                            }
                            // Handle regular lines
                            return (
                                <p key={idx} className={styles.paragraph}>
                                    {line.trim()}
                                </p>
                            );
                        })}
                    </div>
                )}

{step.video && (
  <div className={styles.videoEmbed}>
    <iframe
      width="560"
      height="315"
      src={step.video.replace('watch?v=', 'embed/')}
      title={`Step ${index + 1}`}
      frameBorder="0"
      loading="lazy" // Lazy loading for iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
)}

                {/* Render Image */}
                {step.image && (
                    <img
                        src={`https://cozytiny.com${step.image}`}
                        alt={step.title || `Step ${index + 1}`}
                        className={styles.stepImage}
                        loading="lazy"
                    />
                )}
            </div>
        ))}
    </div>
)}
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params || {};

    if (!slug) {
        return { notFound: true };
    }

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'YourSecurePassword123!',
            database: process.env.DB_NAME || 'cms_project',
            port: Number(process.env.DB_PORT) || 3306,
        });

        const [postRows] = await connection.execute<RowDataPacket[]>(
            'SELECT id, title, slug, thumbnail_url, meta_desc, content, category FROM Posts WHERE slug = ?',
            [slug]
        );

        if (postRows.length === 0) {
            return { notFound: true };
        }

        const post = postRows[0];

        let content: ContentItem[] = [];
        try {
            content = JSON.parse(post.content || '[]');
        } catch (error) {
            console.error('Failed to parse content:', error);
        }

        const [stepRows] = await connection.execute<RowDataPacket[]>(
            'SELECT title, content, video_url, image_url FROM steps WHERE post_id = ?',
            [post.id]
        );

        const steps = stepRows.map((step) => ({
            title: step.title,
            content: step.content,
            video: step.video_url,
            image: step.image_url,
        }));

        await connection.end();

        return {
            props: {
                post: { ...post, content },
                steps,
            },
        };
    } catch (error) {
        console.error('Error fetching post:', error);
        return { notFound: true };
    }
};

export default PostDetailsPage;