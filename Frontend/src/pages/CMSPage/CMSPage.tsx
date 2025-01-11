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
                const response = await fetch('https://cozytiny.com/api/upload', {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
    
            try {
                const response = await fetch('https://cozytiny.com/api/posts/upload-image', {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const imageUrl = data.filePath;
    
                    // Replace the last `[IMAGE]` placeholder in the content array
                    setContent((prevContent) => {
                        const updatedContent = [...prevContent];
                        const placeholderIndex = updatedContent.findIndex(
                            (item) => item.type === 'text' && item.value === '[IMAGE]'
                        );
    
                        if (placeholderIndex !== -1) {
                            updatedContent[placeholderIndex] = { type: 'image', value: imageUrl };
                        } else {
                            // If no placeholder exists, add a new image object
                            updatedContent.push({ type: 'image', value: imageUrl });
                        }
    
                        return updatedContent;
                    });
    
                    console.log('Image uploaded successfully:', imageUrl);
                } else {
                    console.error('Failed to upload image');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
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
        formData.append('thumbnail', thumbnail);
        formData.append('category', category);
    
        // Automatically assign the first image in the content to image_url
        const firstImage = content.find((item) => item.type === 'image' && item.value);
        if (firstImage) {
            formData.append('image_url', firstImage.value);
        }
    
        try {
            const response = await fetch('https://cozytiny.com/api/posts', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const post = await response.json();
                console.log('Post created successfully:', post);
                alert('Post added successfully!');
    
                // Reset the form
                setTitle('');
                setThumbnail(null);
                setMetaDescription('');
                setContent([]);
                setCategory(categories[0].name);
            } else {
                const errorData = await response.json();
                console.error('Failed to add post:', errorData);
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
                <div className={styles.formGroup}>
    <label htmlFor="uploadImage">Upload Additional Image:</label>
    <input
        type="file"
        id="uploadImage"
        accept="image/*"
        onChange={handleImageUpload}
    />
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