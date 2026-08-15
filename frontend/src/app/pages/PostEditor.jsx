import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { POST_CATEGORIES } from "../utils.js";
import api from "../api.js";

export default function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams(); // If we are editing, we would have an ID
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(POST_CATEGORIES[0]);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      // Fetch post if editing (stubbed since backend lacks edit)
      api.get(`/posts/${id}`).then(res => {
        setTitle(res.data.post.title);
        setContent(res.data.post.content);
        setCategory(res.data.post.category);
      }).catch(err => console.error(err));
    }
  }, [id, isEditing]);

  function validate() {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!content.trim()) e.content = "Content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing) {
        if (image) {
          const formData = new FormData();
          formData.append('title', title.trim());
          formData.append('content', content.trim());
          formData.append('category', category);
          formData.append('image', image);

          await api.patch(`/posts/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          await api.patch(`/posts/${id}`, {
            title: title.trim(),
            content: content.trim(),
            category,
          });
        }
        navigate(`/post/${id}`);
      } else {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content.trim());
        formData.append('category', category);
        if (image) {
          formData.append('image', image);
        }

        await api.post('/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to save post");
    }
  }

  return (
    <div className="blog-app">
      <header className="editor-header">
        <div className="editor-header-inner">
          <button type="button" className="btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={13} />
            Back
          </button>
          <span className="editor-mode-label">{isEditing ? "Editing" : "New Post"}</span>
        </div>
      </header>

      <main className="editor-main">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label">Category</label>
            <div className="category-picker">
              {POST_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-pick-btn${category === cat ? " active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              className="input-content"
              style={{ minHeight: 'auto', padding: '0.75rem 1rem' }}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="field">
            <label className="field-label">Title</label>
            <input
              className={`input-title${errors.title ? " error" : ""}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Your headline here…"
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div className="field">
            <label className="field-label">Content</label>
            <textarea
              className={`input-content${errors.content ? " error" : ""}`}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: undefined }));
              }}
              placeholder="Write your post here. Separate paragraphs with a blank line."
              rows={20}
            />
            {errors.content && <p className="field-error">{errors.content}</p>}
          </div>

          <div className="editor-actions">
            <button type="submit" className="btn-publish">
              {isEditing ? "Save Changes" : "Publish Post"}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
