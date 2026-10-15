const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getArticles = async () => {
  const response = await fetch(`${API_URL}/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
};

export const getArticle = async (slug) => {
  const response = await fetch(
    `${API_URL}/articles/${slug}`
  );

  if (!response.ok) {
    throw new Error("Article not found");
  }

  return response.json();
};