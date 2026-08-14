import { ChevronRight, Minus, Plus } from "lucide-react";
import CategoryBadge from "./CategoryBadge.jsx";
import { fmt, excerpt } from "../utils.js";

export default function PostCard({ post, colSpan, onExpand, onContract, onClick }) {
  const excerptLen = colSpan === 1 ? 110 : colSpan === 2 ? 210 : 340;

  return (
    <article className="post-card" style={{ gridColumn: `span ${colSpan}` }}>
      <div className="card-body" onClick={onClick} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        style={{ backgroundColor: "#E9E3D8" }}>
        <div className="card-meta">
          <CategoryBadge category={post.category} />
          <span className="card-date">{fmt(post.createdAt)}</span>
        </div>
        <h2 className="card-title">{post.title}</h2>
        <p className="card-excerpt">{excerpt(post.content, excerptLen)}</p>
        <div className="card-read">
          Read <ChevronRight size={11} />
        </div>
      </div>

      <div className="card-resize-controls">
        <button
          className="resize-btn"
          onClick={onContract}
          disabled={colSpan <= 1}
          title="Contract"
          aria-label="Make card narrower"
        >
          <Minus size={11} />
        </button>
        <span className="resize-span-indicator">{colSpan}</span>
        <button
          className="resize-btn"
          onClick={onExpand}
          disabled={colSpan >= 3}
          title="Expand"
          aria-label="Make card wider"
        >
          <Plus size={11} />
        </button>
      </div>
    </article>
  );
}
