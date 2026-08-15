export const ALL_CATEGORIES = ["All", "Culture", "Technology", "Politics", "Science", "Art", "Fiction", "Opinion"];
export const POST_CATEGORIES = ALL_CATEGORIES.slice(1);

export function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function excerpt(text, len) {
  len = len || 130;
  return text.length > len ? text.slice(0, len).trimEnd() + "…" : text;
}

