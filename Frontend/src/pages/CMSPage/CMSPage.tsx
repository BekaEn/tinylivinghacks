import React, { useState } from 'react';
import styles from '../../styles/CMSPage.module.css';
import { categories } from '../../utils/categories';

const CMSPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [metaDescription, setMetaDescription] = useState('');
    const [content, setContent] = useState<{ type: string; value: string }[]>([]);
    const [category, setCategory] = useState(categories[0].name); // Default to the first category
    const [posts, setPosts] = useState<
        { title: string; thumbnail: string; metaDescription: string; content: { type: string; value: string }[]; category: string }[]
    >([]);

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
    
            // Create form data to upload the image
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                // Upload the image to the backend
                const response = await fetch('http://cozytiny.com/api/upload', {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    const data = await response.json();
                    // Assuming the server returns the image URL
                    const imageUrl = data.url;
    
                    // Add the image URL to the content immediately
                    setContent([...content, { type: 'image', value: imageUrl }]);
                } else {
                    console.error('Failed to upload image');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedText = e.target.value;
        const textArray = updatedText.split('\n').map((text) => ({ type: 'text', value: text }));
        setContent(textArray);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!thumbnail) {
            alert('Please upload a thumbnail!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('meta_desc', metaDescription);
        formData.append('content', JSON.stringify(content));
        formData.append('thumbnail', thumbnail); // Include the thumbnail file
        formData.append('category', category); // Include the selected category

        try {
            const response = await fetch('http://cozytiny.com/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const post = await response.json();
                setPosts([...posts, post]); // Update the posts state with the new post
                alert('Post added successfully!');

                // Clear the form
                setTitle('');
                setThumbnail(null);
                setMetaDescription('');
                setContent([]);
                setCategory(categories[0].name); // Reset to the first category
            } else {
                alert('Failed to add the post. Please try again.');
            }
        } catch (error) {
            console.error('Error adding post:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className={styles.cmsContainer}>
            <h1>CMS Page</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="thumbnail">Thumbnail:</label>
                    <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="metaDescription">Meta Description:</label>
                    <textarea
                        id="metaDescription"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Content:</label>
                    <textarea
                        value={content
                            .map((item) =>
                                item.type === 'text' ? item.value : `[${item.type.toUpperCase()}]`
                            )
                            .join('\n')}
                        onChange={handleContentChange}
                        placeholder="Write your content here or embed images/videos"
                    ></textarea>
                    <div className={styles.toolbar}>
                        <button type="button" onClick={() => setContent([...content, { type: 'video', value: '' }])}>
                            Embed Video
                        </button>
                    </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                    Add Post
                </button>
            </form>

            <h2>Posts</h2>
            <ul className={styles.postList}>
                {posts.map((post, index) => (
                    <li key={index} className={styles.postItem}>
                        <h3>{post.title}</h3>
                        <p>Category: {post.category}</p>
                        {post.thumbnail && (
                            <img src={post.thumbnail} alt="Thumbnail" className={styles.thumbnail} />
                        )}
                        <p><strong>Meta Description:</strong> {post.metaDescription}</p>
                        <div>
                            <strong>Content:</strong>
                            {post.content.map((item, idx) => (
                                <div key={idx}>
                                    {item.type === 'text' && <p>{item.value}</p>}
                                    {item.type === 'image' && <img src={item.value} alt="Content" />}
                                    {item.type === 'video' && (
                                        <div dangerouslySetInnerHTML={{ __html: item.value }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CMSPage;