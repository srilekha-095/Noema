import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid username or password.");
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-left">
        <div className="auth-left-top">
          <p className="auth-left-eyebrow">Independent · Est. 2026</p>
          <h1 className="auth-left-title">Noema</h1>
        </div>

        <div className="auth-left-mid">
          <div className="auth-left-rule"></div>
          <p className="auth-left-tagline">Essays. Observations.<br />Ideas worth keeping.</p>
          <p className="auth-left-copy">
            An independent journal at the edge of the page — where culture,
            technology, and art find room to breathe.
          </p>
        </div>

        <div className="auth-left-footer">
          {["Culture", "Technology", "Politics", "Art", "Fiction", "Science", "Opinion"].map((cat, i, arr) => (
            <span key={cat} className="auth-left-footer-item">
              <span className="auth-cat">{cat}</span>
              {i < arr.length - 1 && <span className="auth-cat-dot">·</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Sign in</h2>
            <p className="auth-form-sub">Access your account to read and write</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="your_username"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-auth-submit">Sign In</button>
          </form>

          <p className="auth-switch">
            No account yet?{" "}
            <button type="button" className="auth-switch-link" onClick={() => navigate("/register")}>
              Create one
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}
