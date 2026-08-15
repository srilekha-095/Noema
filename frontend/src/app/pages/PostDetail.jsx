import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import CategoryBadge from "../components/CategoryBadge.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import { fmt } from "../utils.js";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.post);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!post) return <div style={{ padding: '2rem', textAlign: 'center' }}>Post not found.</div>;

  const isAuthor = user && post.author && (post.author._id === user._id || post.author === user._id || post.author.username === user.username);
  const imageSrc = post?.image
    ? post.image.startsWith('http')
      ? post.image
      : `http://localhost:5000${post.image}`
    : null;

  return (
    <div className="blog-app">
      <header className="detail-header">
        <div className="detail-header-inner">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={13} />
            Noema
          </button>
          
          {isAuthor && (
            <div className="detail-actions">
              <button className="btn-edit" onClick={() => navigate(`/post/${id}/edit`)}>
                <Edit2 size={11} />
                Edit
              </button>
              <button className="btn-delete" onClick={() => setDeleteTarget(true)}>
                <Trash2 size={11} />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="detail-main">
        <div className="detail-meta">
          <CategoryBadge category={post.category} />
          <span className="detail-date">{fmt(post.createdAt)}</span>
          {post.updatedAt !== post.createdAt && (
            <span className="detail-edited">edited {fmt(post.updatedAt)}</span>
          )}
        </div>

        <h1 className="detail-title">{post.title}</h1>
        
        {imageSrc && (
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src={imageSrc}
              alt={post.title} 
              style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="detail-body">
          {/* {post.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))} */}
          <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        </div>
      </main>

      {deleteTarget && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(false)}
        />
      )}
    </div>
  );
}
