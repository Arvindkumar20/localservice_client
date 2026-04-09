import { useEffect, useState } from "react";

const ACCESS_KEY = import.meta.env.VITE_APP_UNSPLASH_ACCESS_KEY;

export const useImage = (title) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!title) return;

    const fetchImage = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${title}&per_page=1&client_id=${ACCESS_KEY}`
        );

        const data = await res.json();

        if (data.results && data.results.length > 0) {
          setImageUrl(data.results[0].urls.regular);
        } else {
          setImageUrl(null);
        }
      } catch (err) {
        setError("Failed to fetch image");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [title]);

  return { imageUrl, loading, error };
};