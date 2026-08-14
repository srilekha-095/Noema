import { useRef, useState, useEffect } from "react";
import { Search, Plus, X, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import PostCard from "../components/PostCard.jsx";
import { ALL_CATEGORIES } from "../utils.js";
import { useAuth } from "../AuthContext.jsx";
import api from "../api.js";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);
  const [cardSpans, setCardSpans] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (activeCategory !== "All") queryParams.append('category', activeCategory);
        if (selectedAuthor) queryParams.append('author', selectedAuthor);
        queryParams.append('page', currentPage);
        queryParams.append('limit', 9);

        const res = await api.get(`/posts?${queryParams.toString()}`);
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, activeCategory, selectedAuthor, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, selectedAuthor]);

  useEffect(() => {
    if (!user) {
      setSelectedAuthor(null);
    }
  }, [user]);

  function getSpan(id) {
    return cardSpans[id] || 1;
  }

  function changeSpan(id, delta) {
    setCardSpans((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(3, (prev[id] || 1) + delta)),
    }));
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleAuthorToggle() {
    setSelectedAuthor((prev) => (prev === user._id ? null : user._id));
  }

  return (
    <div className="blog-app">
      <header className="blog-header">
        <div className="inner">
          <div className="masthead">
            <div className="masthead-text">
              <p className="eyebrow">Independent · Est. 2026</p>
              <h1 className="site-title">Noema</h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {user ? (
                <>
                  <button
                    type="button"
                    className="masthead-user"
                    style={{ marginRight: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={handleAuthorToggle}
                  >
                    {selectedAuthor ? 'All feeds' : `Hi, ${user.username}`}
                  </button>
                  <button className="btn-new" onClick={() => navigate('/new')}>
                    <Plus size={14} strokeWidth={2.5} />
                    New Post
                  </button>
                  <button className="btn-new" onClick={handleLogout} style={{ background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--foreground)' }}>
                    <LogOut size={14} strokeWidth={2.5} />
                    Logout
                  </button>
                </>
              ) : (
                <button className="btn-new" onClick={() => navigate('/login')} style={{ background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--foreground)' }}>
                  <LogIn size={14} strokeWidth={2.5} />
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="toolbar">
            <div className="search-wrap">
              <span className="search-icon">
                <Search size={13} />
              </span>
              <input
                ref={inputRef}
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts or authors…"
              />
              {search && (
                <button
                  className="search-clear"
                  onClick={() => { setSearch(""); inputRef.current?.focus(); }}
                >
                  <X size={11} />
                </button>
              )}
            </div>

            <div className="category-filters">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="blog-main">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-label">
              {selectedAuthor ? `No posts by ${user?.username || 'this user'} yet` : search ? `No results for "${search}"` : "No posts yet"}
            </p>
            {!search && user && !selectedAuthor && (
              <button className="empty-action" onClick={() => navigate('/new')}>
                Write the first one →
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="post-grid">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  colSpan={getSpan(post._id)}
                  onExpand={() => changeSpan(post._id, 1)}
                  onContract={() => changeSpan(post._id, -1)}
                  onClick={() => navigate(`/post/${post._id}`)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem' }}>
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="detail-date" style={{ alignSelf: 'center' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="blog-footer">
        <div className="footer-inner">
          <span className="footer-brand">Noema</span>
          <span className="footer-count">
            {posts.length} {posts.length === 1 ? "post" : "posts"} published
          </span>
        </div>
      </footer>
    </div>
  );
}
