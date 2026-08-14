import { Routes, Route } from "react-router";
import "./App.css";
import PostList from "./pages/PostList.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PostEditor from "./pages/PostEditor.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useAuth } from "./AuthContext.jsx";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/new" element={user ? <PostEditor /> : <Login />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/post/:id/edit" element={user ? <PostEditor /> : <Login />} />
    </Routes>
  );
}
